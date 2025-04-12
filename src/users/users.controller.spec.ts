import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
    let usersController: UsersController;
    let usersService: UsersService;
  
    const mockUsersService = {
      findAll: jest.fn(),
      findOne: jest.fn(),
    };
  
    const mockUsers: User[] = [
      { id: 1, name: 'John Doe', email: 'john@example.com' },
      { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
    ];
  
    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [UsersController],
        providers: [
          {
            provide: UsersService,
            useValue: mockUsersService,
          },
        ],
      }).compile();
  
      usersController = module.get<UsersController>(UsersController);
      usersService = module.get<UsersService>(UsersService);
    });
  
    describe('findAll', () => {
      it('should return an array of users', async () => {
        mockUsersService.findAll.mockResolvedValue(mockUsers);
  
        const result = await usersController.findAll();
        expect(result).toEqual(mockUsers);
        expect(mockUsersService.findAll).toHaveBeenCalled();
      });
    });
  
    describe('findOne', () => {
      it('should return a user by id', async () => {
        const mockUser = mockUsers[0];
        mockUsersService.findOne.mockResolvedValue(mockUser);
  
        const result = await usersController.findOne(1);
        expect(result).toEqual(mockUser);
        expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
      });
  
      it('should throw NotFoundException if user not found', async () => {
        mockUsersService.findOne.mockResolvedValue(null);
  
        await expect(usersController.findOne(999)).rejects.toThrow("User not found");
      });
    });
  });

