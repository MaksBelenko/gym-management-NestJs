import { Injectable, NotFoundException } from '@nestjs/common';
import { GymClass } from '../Models/gym-class.model';
import { GymSessionStatus } from './gymsession-status.enum';
import { UtcDateObject } from '../shared/date-object.model';
import { CreateGymClassDto } from '../DTOs/create-gym-class.dro';
import { GetFilteredGymClassesDto } from '../DTOs/get-filtered-gym-classes.dto';

@Injectable()
export class GymClassesService {
    private gymClasses: GymClass[] = [
        {
            id: '123',
            name: 'test name',
            description: 'test description',
            imageUrl: 'http://test.com',
        },
        {
            id: '111',
            name: '111 name',
            description: 'description 111',
            // startDate: new UtcDateObject().toIsoString(),
            // finishDate: new UtcDateObject().toIsoString(),
        },
    ];

    getAllGymClasses(): GymClass[] {
        return this.gymClasses;
    }

    getTasksWithFilters(filterDto: GetFilteredGymClassesDto): GymClass[] {
        const { search } = filterDto;

        let filteredClasses = this.getAllGymClasses();

        if (search) {
            filteredClasses = filteredClasses.filter(
                gymClass =>
                    gymClass.name.includes(search) ||
                    gymClass.description.includes(search),
            );
        }

        return filteredClasses;
    }

    getGymClassById(id: string): GymClass {
        const found = this.gymClasses.find(gymClass => gymClass.id === id);

        if (!found) {
            throw new NotFoundException(`Gym class with id = ${id} does not exist`);
        }

        return found;
    }

    deleteGymClassById(id: string): GymClass {
        const gymClassToDelete = this.getGymClassById(id);
        this.gymClasses = this.gymClasses.filter(
            gymClass => gymClass.id !== id,
        );
        return gymClassToDelete;
    }

    createGymClass(createClassDto: CreateGymClassDto): GymClass {
        const { name, description } = createClassDto;

        const gymClass: GymClass = {
            id: '1234',
            name,
            description,
            imageUrl: 'testUrl',
        };

        this.gymClasses.push(gymClass);
        return gymClass;
    }
}
