import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDto } from './dto/auth-credential.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    
    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { fullName, email, password } = authCredentialsDto;

        const user = new User();
        user.fullName = fullName;
        user.email = email;
        user.salt = await bcrypt.genSalt();
        user.password = await this.hashPassword(password, user.salt);

        // try {
            await user.save();
        // } catch (error) {
        //     if (error.code === '23505') {
        //         throw new ConflictException('Username already exists');
        //     } else {
        //         throw new InternalServerErrorException();
        //     }
        // }
    }

    async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { email, password } = authCredentialsDto;
        const user = await this.findOne({ email });

        if (user && await this.validatePassword(user, password)) {
            return user.email;
        } else {
            return null;
        }
    }

    private hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }

    async validatePassword(user: User, passwordToValidate: string): Promise<boolean> {
        const hashedPassword = await bcrypt.hash(passwordToValidate, user.salt);
        return hashedPassword == user.password;
    }
}