import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GymSessionRepository } from './gym-session.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { GymClassRepository } from '../gym-classes/gym-class.repository';
import { GymSession } from './gym-session.entity';
import { GetSessionsFilterDto } from './dto/get-sessions-filter.dto';

@Injectable()
export class GymSessionsService {

    constructor(
        @InjectRepository(GymSessionRepository)
        private sessionRepository: GymSessionRepository,
        @InjectRepository(GymClassRepository)
        private gymClassRepository: GymClassRepository,
    ) {}


    async getSessions(filterDto: GetSessionsFilterDto): Promise<GymSession[]> {
        return this.sessionRepository.getSessions(filterDto);
    }
    

    async getSessionById(id: string) {
        return this.sessionRepository.findOne(id);
    }

    async createSession(createSessionDto: CreateSessionDto): Promise<GymSession> {
        const { gymClassId } = createSessionDto;

        const foundClass = await this.gymClassRepository.findOne(gymClassId);

        if (!foundClass) {
            throw new NotFoundException(`Unable to create a session as no class exists with id = ${gymClassId}`);
        }

        return this.sessionRepository.createSession(createSessionDto, foundClass);
    }
}
