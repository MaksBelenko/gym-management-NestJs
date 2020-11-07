import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { GymSession } from './gym-session.entity';
import { GymSessionsService } from './gym-sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';

@Controller('gym-sessions')
export class GymSessionsController {

    constructor(private sessionService: GymSessionsService) {}

    @Get('/:id')
    getSessionById(@Param('id') id: string): Promise<GymSession> {
        return this.sessionService.getSessionById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createSession(@Body() createSessionDto: CreateSessionDto): Promise<GymSession> {
        return this.sessionService.createSession(createSessionDto);
    }
}
