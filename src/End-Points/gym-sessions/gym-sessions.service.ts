import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GymSessionRepository } from './gym-session.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { GymClassRepository } from '../gym-classes/gym-class.repository';
import { GymSession } from './gym-session.entity';
import { GetSessionsFilterDto } from './dto/get-sessions-filter.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { TrainerRepository } from '../trainers/trainer.repository';

@Injectable()
export class GymSessionsService {
    private readonly logger = new Logger(this.constructor.name);

    constructor(
        private sessionRepository: GymSessionRepository,
        private gymClassRepository: GymClassRepository,
        private trainerRepository: TrainerRepository,
    ) {}


    /**
     * Gets all session with applied filers if defined
     * @param filterDto Filter DTO with query parameters
     */
    async getSessions(filterDto: GetSessionsFilterDto): Promise<GymSession[]> {
        this.logger.log(`Getting sessions...`)
        return this.sessionRepository.getSessions(filterDto);
    }
    
    /**
     * Gets Session by ID
     * @param id ID of the session to be retrieved
     */
    async getSessionById(id: string): Promise<GymSession> {
        const session = this.sessionRepository.getSessionById(id);

        if (!session) {
            throw new NotFoundException(`Gym session with id = ${id} not found`);
        }

        return session;
    }

    /**
     * Create session with information provided in DTO
     * @param createSessionDto DTO containing information for creating a new session
     */
    async createSession(createSessionDto: CreateSessionDto): Promise<GymSession> {
        const { gymClassId, trainerId } = createSessionDto;

        const foundClass = await this.gymClassRepository.findOne(gymClassId);
        const foundTrainer = await this.trainerRepository.findOne(trainerId);

        if (!foundClass) {
            const errorMessage = `Unable to create a session as no class exists with id = ${gymClassId}`;
            this.logger.error(errorMessage);
            throw new NotFoundException(errorMessage);
        }

        if (!foundTrainer) {
            const errorMessage = `Unable to create a session as no trainer exists with id = ${trainerId}`;
            this.logger.error(errorMessage);
            throw new NotFoundException(errorMessage);
        }

        return this.sessionRepository.createSession(
            createSessionDto, 
            foundClass, 
            foundTrainer
        );
    }

    async updateSession(sessionId: string, updateSessionDto: UpdateSessionDto): Promise<GymSession> {
        const { newGymClassId } = updateSessionDto;
        const newGymClass = await this.gymClassRepository.findOne(newGymClassId)

        return this.sessionRepository.updateSession(sessionId, updateSessionDto, newGymClass);
    }


    /**
     * Tries to delete session with ID
     * @param id ID of the session to be deleted
     */
    async deleteSession(id: string): Promise<void> {
        const result = await this.sessionRepository.delete(id);

        if (result.affected === 0){
            throw new NotFoundException(`Gym session with id ${id} not found`)
        }
    }
    
}
