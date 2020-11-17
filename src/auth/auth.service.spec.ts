import {JwtService} from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {User} from '../users/users.models';
import {Repository} from 'typeorm';
import {AuthService} from './auth.service'
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt')

describe('AuthService', () => {
  let jwtService: JwtService
  let bcryptCompare: jest.Mock;
  let userRepo: Repository<User>
  let service: AuthService
  let testUser: User

  beforeEach(async () => {
    bcryptCompare = jest.fn().mockImplementation((pass1, pass2) => pass1 === pass2);
    (bcrypt.compareSync as jest.Mock) = bcryptCompare;

    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService, 
        {
          provide: JwtService,
          useFactory: () => ({
            sign: jest.fn(() => 'signed payload')
          })
        }, 
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        }
      ]
    }).compile()
    jwtService = await moduleRef.get<JwtService>(JwtService)
    userRepo = await moduleRef.get<Repository<User>>(getRepositoryToken(User))
    service = await moduleRef.get<AuthService>(AuthService)
    testUser = {
      username: 'admin',
      password: 'strongpass',
      email: 'admin@admin.com',
      id: 1,
      isAdmin: true,
    }
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should sign access token with payload', async () => {
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce('signed')

      const result = await service.login(testUser)

      expect(result.access_token).toBe('signed')
    }) 
  });

  describe('validateUser', () => {
    it('should not be valid when user is not founded', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null)

      const result = await service.validateUser('admin', 'admin')

      expect(result).toBe(null)
    })

    it('should not be valid when user password do not match', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser)

      const result = await service.validateUser('admin', 'admin')

      expect(result).toBe(null)
    })

    it('should be valid when user is founded and password match', async () => {
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(testUser)

      const result = await service.validateUser('admin', 'strongpass')

      expect(result).toEqual({
        username: 'admin',
        email: 'admin@admin.com',
        id: 1,
        isAdmin: true,
      })
    })
  })
});
