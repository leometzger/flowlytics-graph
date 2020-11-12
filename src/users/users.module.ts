import {Module} from '@nestjs/common';
import {User} from './users.models' 
import {TypeOrmModule} from '@nestjs/typeorm';
import {UsersResolver} from './users.resolver'
import {UsersFactory} from './users.factory'

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [TypeOrmModule.forFeature([User])],
  providers: [UsersResolver, UsersFactory]
})
export class UsersModule {}
