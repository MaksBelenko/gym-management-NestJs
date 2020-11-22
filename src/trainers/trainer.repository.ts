import { EntityRepository, Repository } from 'typeorm';
import { ConflictException } from '@nestjs/common';
import { Trainer } from './trainer.entity';
import { TrainerType } from './trainer-type.enum';
import { GetTrainersFilterDto } from './dto/get-trainers-filter.dto';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import '../extensions/string.extension';

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

    /**
     * Helper method to find weather combination of forename and surname exists in
     * "trainer" table (case insensitive)
     * @param forename Looks for matching forename
     * @param surname Looks for matching surname
     */
    private async findSame(forename: string, surname: string): Promise<Trainer> {
        const query = this.createQueryBuilder('trainer');

        query.andWhere('LOWER(trainer.forename) = LOWER(:forename)', { forename });
        query.andWhere('LOWER(trainer.surname) = LOWER(:surname)', { surname });

        return query.getOne();
    }
}
