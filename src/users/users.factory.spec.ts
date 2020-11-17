import {UsersFactory} from './users.factory'

describe('UsersFactory', () => {
  const factory: UsersFactory = new UsersFactory()

  describe('createSuperuser', () => {
    it('should create admin user', async () => {
      const user = await factory.createSuperuser({
        username: 'admin',
        email: 'admin@mail.com', 
        password: 'strong pass', 
      })

      expect(user.isAdmin).toBe(true)
      expect(user.password).not.toEqual('strong pass')
      expect(user.email).toBe('admin@mail.com')
      expect(user.username).toBe('admin')
    })
  });

  describe('createUser', () => {
    it('should create admin user', async () => {
      const user = await factory.createUser({
        username: 'notadmin',
        email: 'notadmin@mail.com', 
        password: 'password', 
      })

      expect(user.isAdmin).toBe(false)
      expect(user.password).not.toEqual('password')
      expect(user.email).toBe('notadmin@mail.com')
      expect(user.username).toBe('notadmin')
    })
  });
});
