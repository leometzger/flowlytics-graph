import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from '../users/users.models'
import {compareSync} from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userRepository.findOne({where: {username}});
    const isAuthValid = user && compareSync(pass, user.password)

    if (isAuthValid) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {username: user.username, sub: user.id};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
