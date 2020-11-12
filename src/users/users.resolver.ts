import {NotAcceptableException, UseGuards} from '@nestjs/common';
import {Args, Resolver, Query, Mutation} from '@nestjs/graphql'
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './users.models'
import {UserInput} from './users.mutations'
import {GqlAuthGuard} from '../auth/graphql-guard'
import {UsersFactory} from './users.factory';


Resolver(of => User)
export class UsersResolver {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userFactory: UsersFactory
  ) {}

  @Query(returns => [User])
  @UseGuards(GqlAuthGuard)
  users(): Promise<User[]> {
    return this.userRepository.find()
  }

  @Mutation(type => User)
  async createSuperUser(@Args({name: 'user'}) userIn: UserInput) {
    const superUserExists= await this.userRepository.count()

    if(superUserExists) {
      throw new NotAcceptableException()
    }
    const user = await this.userFactory.createSuperuser(userIn)

    await this.userRepository.save(user)
    return user
  }

  @Mutation(type => User)
  @UseGuards(GqlAuthGuard)
  async createUser(@Args({name: 'user'}) userIn: UserInput) {
    const user = await this.userFactory.createUser(userIn)

    await this.userRepository.save(user)
    return user
  }
}
