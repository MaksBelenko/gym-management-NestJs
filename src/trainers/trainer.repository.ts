import { EntityRepository, Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Trainer } from './trainer.entity';
import { TrainerType } from './trainer-type.enum';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';
import '../extensions/string.extension';
import '../extensions/base-entity.extension'
import { BaseEntity } from 'typeorm/repository/BaseEntity';

@EntityRepository(Trainer)
export class TrainerRepository extends Repository<Trainer> {
    

    async getTrainers(filterDto: GetTrainersFilterDto): Promise<Trainer[]> {
        const { search } = filterDto;
        const query = this.createQueryBuilder('trainer');

        query.leftJoinAndSelect('trainer.photos', 'photo');

        if (search) {
            query.andWhere('LOWER(trainer.name) LIKE :search', { search: `%${search.toLowerCase()}%` }) // "%%" <- partial search
        }

        const fetchedTrainers = await query.getMany();
        return fetchedTrainers;
    }


    async getTrainerById(id: string, includeSessions = false): Promise<Trainer> {
        const query = this.createQueryBuilder('trainer');

        query.leftJoinAndSelect('trainer.photos', 'photo');
        
        if (includeSessions) {
            query.leftJoinAndSelect('gymClass.sessions', 'session');
        }

        query.andWhere('trainer.id = :id', { id });

        return query.getOne();
    }


    async createTrainer(createTrainerDto: CreateTrainerDto): Promise<Trainer> {
        const { forename, surname, description, type } = createTrainerDto;

        const exist = await this.findSame(forename, surname);
        if (exist) {
            throw new ConflictException(`Trainer with forename = ${exist.forename} and surname = ${exist.surname} already exists`);
        }

        const trainer = new Trainer();
        trainer.forename = String.capitalise(forename);// forename.capitalise();
        trainer.surname = String.capitalise(surname);  //surname.capitalise();
        trainer.description = description;
        trainer.type = (type) ? type : TrainerType.PERMANENT;

        return trainer.save()
    }


    async updateTrainer(id: string, updateDto: UpdateTrainerDto): Promise<Trainer> {
        const foundTrainer = await this.findOne(id);

        if (!foundTrainer) {
            throw new NotFoundException(`Trainer with id = ${id} not found`);
        }

        const { forename, surname } = updateDto;

        const exists = await this.findSame(forename, surname)
        if (exists) {
            throw new ConflictException(`Trainer with forename = ${forename} and surname = ${surname} already exists; `+ 
                                                        `Modifying same entity = ${exists.id === foundTrainer.id}`);
        }

        foundTrainer.updateWithDto(updateDto);

        return foundTrainer.save();
    }

    /**
     * Helper method to find weather combination of forename and surname exists in
     * "trainer" table (case insensitive)
     * @param forename Looks for matching forename
     * @param surname Looks for matching surname
     */
    private async findSame(forename: string, surname: string): Promise<Trainer> {

        if (!forename || !surname) {
            return null;
        }

        const query = this.createQueryBuilder('trainer');

        query.andWhere('LOWER(trainer.forename) = LOWER(:forename)', { forename });
        query.andWhere('LOWER(trainer.surname) = LOWER(:surname)', { surname });

        return query.getOne();
    }
}
