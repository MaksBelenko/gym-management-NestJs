import { Between, EntityRepository, LessThan, MoreThanOrEqual, Repository } from "typeorm";
import { GymSession } from './gym-session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { GymClass } from "src/gym-classes/gym-class.entity";
import { GymSessionStatus } from "src/gym-classes/gymsession-status.enum";
import { DateHelper } from '../helpers/date.helper';
import { GetSessionsFilterDto } from './dto/get-sessions-filter.dto';

@EntityRepository(GymSession)
export class GymSessionRepository extends Repository<GymSession> {

    async getSessions(filterDto: GetSessionsFilterDto): Promise<GymSession[]> {
        const { start, end } = filterDto;

        const query = this.createQueryBuilder('gymSession');

        if (start) {
            query.andWhere('gymSession.startDate >= :start', { start });
            query.andWhere('gymSession.finishDate >= :start', { start });
        }

        if (end) {
            query.andWhere('gymSession.startDate <= :end', { end });
            query.andWhere('gymSession.finishDate <= :end', { end });
        }

        const fetchedSessions = await query.getMany();
        return fetchedSessions;
    }


    async createSession(createSessionDto: CreateSessionDto, gymClass: GymClass): Promise<GymSession> {
        const { startDate, finishDate } = createSessionDto;

        const dateHelper = new DateHelper();

        const newSession = new GymSession();
        newSession.status = GymSessionStatus.PLACES_AVAILABLE;
        newSession.gymClass = gymClass;
        newSession.startDate = dateHelper.convertToUtc(startDate);
        newSession.finishDate = dateHelper.convertToUtc(finishDate);
        await newSession.save();

        // Set to return the current UTC ISO date
        newSession.startDate = new Date(startDate);
        newSession.finishDate = new Date(finishDate);

        return newSession;
    }
}