import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // Mock de User con los campos correctos según la entidad User
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated John Doe' }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one user', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw if user not found (findOne)', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null); // Mockea que no se encontró el usuario
    await expect(controller.findOne(99)).rejects.toThrow('User not found');
  });

  it('should create a user', async () => {
    const result = await controller.create(mockUser);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(mockUser);
  });

  it('should update a user', async () => {
    const updatedUser = { ...mockUser, name: 'Updated John Doe' };
    jest.spyOn(service, 'findOne').mockResolvedValue(updatedUser); // Mockea la respuesta del servicio para el usuario actualizado

    const result = await controller.update(1, updatedUser);
    expect(result).toEqual(updatedUser);
    expect(service.update).toHaveBeenCalledWith(1, updatedUser);
  });

  it('should delete a user', async () => {
    await controller.delete(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('should throw if user not found (delete)', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null); // Mockea que no se encontró el usuario
    await expect(controller.delete(999)).rejects.toThrow('User not found...!');
  });
});
