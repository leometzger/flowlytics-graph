import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {UsersModule} from '../users/users.module';
import {LocalStrategy} from './local.strategy';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {JwtStrategy} from './jwt.strategy'

@Module({
  imports: [
    UsersModule, 
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: '300s' },
      })
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
