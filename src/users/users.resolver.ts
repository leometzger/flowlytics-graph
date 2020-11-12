import {NotAcceptableException, UseGuards} from '@nestjs/common';
import {Args, Resolver, Query, Mutation} from '@nestjs/graphql'
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './users.models'
import {UserInput} from './users.mutations'
import {GqlAuthGuard} from '../auth/graphql-guard'
import {hash} from 'bcrypt';


Resolver(of => User)
export class UsersResolver {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}

  @Query(returns => [User])
  users(): Promise<User[]> {
    return this.userRepository.find()
  }

  @Mutation(type => User)
  async createSuperUser(@Args({name: 'user'}) userIn: UserInput) {
    const userCount = await this.userRepository.count()

    if(userCount >= 1) {
      throw new NotAcceptableException()
    }

    const hashedPass = await hash(userIn.password, 10)
    const user = new User({
      username: userIn.username,
      email: userIn.email, 
      password: hashedPass,
      isAdmin: true, 
    }) 
    await this.userRepository.save(user)
    return user
  }

  @Mutation(type => User)
  async createUser(@Args({name: 'user'}) userIn: UserInput) {
    const hashedPass = await hash(userIn.password, 10)
    const user = new User({
      username: userIn.username,
      email: userIn.email, 
      password: hashedPass,
      isAdmin: false, 
    }) 
    await this.userRepository.save(user)
    return user
  }
}
