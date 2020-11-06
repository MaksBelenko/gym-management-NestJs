import { EntityRepository, Repository } from 'typeorm';
import { GymClass } from './gym-class.entity';
import { CreateGymClassDto } from '../DTOs/create-gym-class.dro';
import { GetFilteredGymClassesDto } from '../DTOs/get-filtered-gym-classes.dto';

@EntityRepository(GymClass)
export class GymClassRepository extends Repository<GymClass> {

    async getGymClasses(filterDto: GetFilteredGymClassesDto): Promise<GymClass[]> {
        const { search } = filterDto;
        const query = this.createQueryBuilder('gymClass');

        // if (status) {
        //     query.andWhere('gymClass.status = :status', {status: 'OPEN'});
        // }

        if (search) {
            query.andWhere('gymClass.name LIKE :search OR gymClass.description LIKE :search', { search: `%${search}%` }) // "%%" <- partial search
        }

        const fetchedClasses = await query.getMany();

        return fetchedClasses;
    }

    async createGymClass(createClassDto: CreateGymClassDto): Promise<GymClass> {
        const { name, description } = createClassDto;

        const gymClass = new GymClass();
        gymClass.name = name;
        gymClass.description = description;
        gymClass.imageUrl = 'testURL';
        await gymClass.save();

        return gymClass;
    }
}
