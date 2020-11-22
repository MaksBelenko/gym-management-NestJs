import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { GymSession } from './gym-session.entity';
import { GymSessionsService } from './gym-sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { GetSessionsFilterDto } from './dto/get-sessions-filter.dto';
import { DateQueryValidationPipe } from '../Pipes/date-query.validation.pipe';
import { TransformInterceptor } from '../Interceptors/transform.interceptor';
import { GymSessionStatus } from './gymsession-status.enum';
import { UpdateSessionDto } from './dto/update-session.dto';

@Controller('gym-sessions')
@UseInterceptors(TransformInterceptor)
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

    @Delete('/:id')
    deleteSession(@Param('id') id: string): Promise<void> {
        return this.sessionService.deleteSession(id);
    }

    @Patch('/:id')
    @UsePipes(ValidationPipe)
    changeSessionStatus(
        @Param('id') id: string,
        @Body() updateSessionDto: UpdateSessionDto,
    ): Promise<GymSession> {
        return this.sessionService.updateSession(id, updateSessionDto);
    }
}
