import { EntityRepository, Repository } from 'typeorm';
import { Trainer } from './trainer.entity';

@EntityRepository(Trainer)
export class TrainerRepository extends Repository<Trainer> {
    
}
