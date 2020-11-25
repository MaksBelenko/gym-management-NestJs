import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GymClassesModule } from './gym-classes/gym-classes.module';
import { TrainersModule } from './trainers/trainers.module';
import { GymSessionsModule } from './gym-sessions/gym-sessions.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PhotosModule } from './Shared-Modules/photos/photos.module';
import { TokensModule } from './Shared-Modules/tokens/tokens.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot(typeOrmConfig),
        GymClassesModule, 
        TrainersModule, 
        GymSessionsModule, 
        AuthModule,
        PhotosModule,
        TokensModule,
    ],
})
export class AppModule {}
