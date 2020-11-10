import { Injectable, NotFoundException } from '@nestjs/common';
import { GymSessionStatus } from './gymsession-status.enum';
import { UtcDateObject } from '../shared/date-object.model';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';
import { GymClassRepository } from './gym-class.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GymClass } from './gym-class.entity';

@Injectable()
export class GymClassesService {
    constructor(
        @InjectRepository(GymClassRepository)
        private gymClassRepository: GymClassRepository,
    ) {}

    async getGymClasses(filterDto: GetFilteredGymClassesDto): Promise<GymClass[]> {
        return this.gymClassRepository.getGymClasses(filterDto);
    }

    async getGymClassById(id: string): Promise<GymClass> {
        const found = await this.gymClassRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Gym class with id = ${id} does not exist`);
        }

        return found;
    }

    async createGymClass(createClassDto: CreateGymClassDto): Promise<GymClass> {
        return await this.gymClassRepository.createGymClass(createClassDto);
    }

    async deleteGymClassById(id: string): Promise<void> {
        const result = await this.gymClassRepository.delete(id);

        if (result.affected === 0){
            throw new NotFoundException(`Gym class with id ${id} not found`)
        }
    }
}
