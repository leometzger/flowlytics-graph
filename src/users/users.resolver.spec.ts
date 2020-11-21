import {GoneException} from "@nestjs/common";
import {Test} from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {UsersFactory} from "./users.factory";
import {User} from "./users.models";
import { UsersResolver } from "./users.resolver";


describe('UsersResolver', () => {
  let usersRepo: Repository<User>
  let usersFactory: UsersFactory
  let usersResolver: UsersResolver
  let testUser: User

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersResolver,
        UsersFactory,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        }
      ]
    }).compile()
    usersRepo = await moduleRef.get<Repository<User>>(getRepositoryToken(User))
    usersFactory = await moduleRef.get<UsersFactory>(UsersFactory)
    usersResolver = await moduleRef.get<UsersResolver>(UsersResolver)
    testUser = {
      username: 'admin',
      password: 'strongpass',
      email: 'admin@admin.com',
      id: 1,
      isAdmin: true,
    }
  })

  describe('createSuperuser', () => {
    it('should not be save when already exists a user', async () => {
      jest.spyOn(usersRepo, 'count').mockResolvedValueOnce(1)

      try {
        await usersResolver.createSuperUser({
          username: 'admin',
          password: 'strongpass', 
          email: 'admin@mail.com', 
        })
      } catch(e) {
        expect(e).toBeInstanceOf(GoneException)
      }
    })    

    it('should save when users db are clean', async () => {
      jest.spyOn(usersRepo,'save').mockResolvedValue(testUser)
      jest.spyOn(usersRepo,'count').mockResolvedValue(0)
      jest.spyOn(usersFactory, 'createSuperuser').mockResolvedValue(testUser)

      const user = await usersResolver.createSuperUser({
        username: 'admin',
        password: 'strongpass', 
        email: 'admin@mail.com', 
      })

      expect(user).toEqual(testUser)
    })
  });
});