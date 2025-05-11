import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockUsersRepository = {
    find: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockReturnValue(mockUser),
    save: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await service.findAll();
    expect(result).toEqual([mockUser]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockUser);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

 it('should throw an error if user not found (findOne)', async () => {
  // Mockea el comportamiento de findOne para devolver null
  jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
  
  // Verifica que se lanza el error esperado
  await expect(service.findOne(999)).rejects.toThrow('User not found');
});

  it('should create a user', async () => {
    const result = await service.create(mockUser);
    expect(result).toEqual(mockUser);
    expect(repository.create).toHaveBeenCalledWith(mockUser);
    expect(repository.save).toHaveBeenCalledWith(mockUser);
  });

  it('should update a user', async () => {
    const updatedUser = { ...mockUser, name: 'Updated John Doe' };
    jest.spyOn(repository, 'findOne').mockResolvedValueOnce(updatedUser);  // Ensure the updated user is returned
    const result = await service.update(1, updatedUser);
    expect(result).toEqual(updatedUser);  // Expect the updated user
    expect(repository.update).toHaveBeenCalledWith(1, updatedUser);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should delete a user', async () => {
    await service.delete(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});
