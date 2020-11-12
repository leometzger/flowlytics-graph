import {Module} from '@nestjs/common';
import {User} from './users.models' 
import {TypeOrmModule} from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule.forFeature([User])]
})
export class UsersModule {}
