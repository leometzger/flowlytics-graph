import {Injectable} from "@nestjs/common";
import {User} from './users.models'
import {hash} from 'bcrypt';


@Injectable()
export class UsersFactory {
  async createSuperuser({email, password, username}): Promise<User> {
    const hashedPass = await hash(password, 10)

    return new User({
      username: username,
      email: email, 
      password: hashedPass,
      isAdmin: true, 
    })
  } 

  async createUser({email, password, username}): Promise<User> {
    const hashedPass = await hash(password, 10)

    return new User({
      username: username,
      email: email, 
      password: hashedPass,
      isAdmin: false, 
    }) 
  }
}