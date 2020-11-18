import { EntityRepository, Repository } from 'typeorm';
import { GymClass } from './gym-class.entity';
import { CreateGymClassDto } from './dto/create-gym-class.dto';
import { GetFilteredGymClassesDto } from './dto/get-filtered-gym-classes.dto';

@EntityRepository(GymClass)
export class GymClassRepository extends Repository<GymClass> {

    async getGymClasses(filterDto: GetFilteredGymClassesDto): Promise<GymClass[]> {
        const { search } = filterDto;
        const query = this.createQueryBuilder('gymClass');

        // if (status) {
        //     query.andWhere('gymClass.status = :status', {status: 'OPEN'});
        // }

        if (search) {
            query.andWhere('LOWER(gymClass.name) LIKE :search OR gymClass.description LIKE :search', { search: `%${search.toLowerCase()}%` }) // "%%" <- partial search
        }

        const fetchedClasses = await query.getMany();

        return fetchedClasses;
    }

    async createGymClass(createClassDto: CreateGymClassDto): Promise<GymClass> {
        const { name, description } = createClassDto;

        const gymClass = new GymClass();
        gymClass.name = name;
        gymClass.description = description;
        await gymClass.save();

        return gymClass;
    }

    async getGymClassById(id: string): Promise<GymClass> {
        const query = this.createQueryBuilder('gymClass');

        // left join is need as many-to-many relationship
        query.leftJoinAndSelect('gymClass.photos', 'photo')
        query.andWhere('gymClass.id = :id', { id });

        return query.getOne();
    }
}
