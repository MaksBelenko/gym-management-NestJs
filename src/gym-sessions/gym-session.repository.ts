import { EntityRepository, Repository } from "typeorm";
import { GymSession } from './gym-session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { GymClass } from "src/gym-classes/gym-class.entity";
import { GymSessionStatus } from "src/gym-classes/gymsession-status.enum";

@EntityRepository(GymSession)
export class GymSessionRepository extends Repository<GymSession> {

    async createSession(createSessionDto: CreateSessionDto, gymClass: GymClass): Promise<GymSession> {
        const { startDate, finishDate } = createSessionDto;

        const newSession = new GymSession();
        newSession.status = GymSessionStatus.PLACES_AVAILABLE;
        newSession.gymClass = gymClass;
        newSession.startDate = startDate;
        newSession.finishDate = finishDate;
        await newSession.save();

        return newSession;
    }
}