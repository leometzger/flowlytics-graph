import {LoginInput} from './auth.mutations'
import {UnauthorizedException} from '@nestjs/common'
import {Resolver, Mutation, Args} from '@nestjs/graphql'
import {AuthService} from './auth.service'
import {AuthToken} from './auth.mutations';


@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService
  ) {}


  @Mutation(returns => AuthToken)
  async login(@Args('login') {username, password}: LoginInput) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
}