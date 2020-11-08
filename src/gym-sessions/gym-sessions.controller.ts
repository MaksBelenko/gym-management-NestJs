import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { GymSession } from './gym-session.entity';
import { GymSessionsService } from './gym-sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { GetSessionsFilterDto } from './dto/get-sessions-filter.dto';
import { DateQueryValidationPipe } from '../Pipes/date-query.validation.pipe';

@Controller('gym-sessions')
export class GymSessionsController {
    constructor(private sessionService: GymSessionsService) {}

    @Get()
    getSessions(
        @Query(ValidationPipe, DateQueryValidationPipe)
        filterDto: GetSessionsFilterDto,
    ): Promise<GymSession[]> {
        return this.sessionService.getSessions(filterDto);
    }

    @Get('/:id')
    getSessionById(@Param('id') id: string): Promise<GymSession> {
        return this.sessionService.getSessionById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createSession(
        @Body() createSessionDto: CreateSessionDto,
    ): Promise<GymSession> {
        return this.sessionService.createSession(createSessionDto);
    }
}
