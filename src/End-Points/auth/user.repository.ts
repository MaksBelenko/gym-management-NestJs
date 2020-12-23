import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';
import { RegisterCredentialsDto } from './dto/register-credential.dto';
import { LoginCredentialsDto } from './dto/login-credentials.dto';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async registerUnconfirmedUser(registerCredentialsDto: RegisterCredentialsDto): Promise<User> {
        const { fullName, email, password } = registerCredentialsDto;

        const user = this.create();
        user.fullName = fullName;
        user.email = email.toLowerCase();
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);
        
        user.confirmed = false;
        user.confirmationTries = 0;
        user.initialRegisterTryTime = new Date();

        return user.save();
    }

    async setUserConfirmed(email: string): Promise<User> {
        const user = await this.findOne({ email });

        if (!user) {
            throw new NotFoundException();
        }

        user.confirmed = true;
        return user.save();
    }


    async changePassword(user: User, newPassword: string): Promise<User> {
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(newPassword, user.salt);

        return user.save();
    }

    async validateUserPassword(loginCredentialsDto: LoginCredentialsDto): Promise<string> {
        const { email, password } = loginCredentialsDto;
        const user = await this.findOne({ email });

        if (user && await this.validatePassword(user, password)) {
            return user.email;
        }

        return null;
    }

    async validatePassword(user: User, passwordToValidate: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(passwordToValidate, user.salt);
        return hashedPassword == user.password;
    }

    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}