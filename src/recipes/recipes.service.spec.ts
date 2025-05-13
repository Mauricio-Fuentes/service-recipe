import { Test, TestingModule } from '@nestjs/testing';
import { RecipesService } from './recipes.service';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('RecipesService', () => {
  let service: RecipesService;
  let repository: Repository<Recipe>;

  // Mock de Recipe
  const mockRecipe: Recipe = {
    id: 1,
    name: 'Pizza',
    ingredient: 'cheese',
    quantity: 2,
  };

  const mockRepository = {
    find: jest.fn().mockResolvedValue([mockRecipe]),
    findOne: jest.fn().mockResolvedValue(mockRecipe),
    create: jest.fn().mockReturnValue(mockRecipe),
    save: jest.fn().mockResolvedValue(mockRecipe),
    update: jest.fn().mockResolvedValue(mockRecipe),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecipesService,
        {
          provide: getRepositoryToken(Recipe),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<RecipesService>(RecipesService);
    repository = module.get<Repository<Recipe>>(getRepositoryToken(Recipe));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all recipes', async () => {
    const result = await service.findall();
    expect(result).toEqual([mockRecipe]);
    expect(repository.find).toHaveBeenCalled();
  });

  it('should return one recipe', async () => {
    const result = await service.findOne(1);
    expect(result).toEqual(mockRecipe);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should create a recipe', async () => {
    const result = await service.create(mockRecipe);
    expect(result).toEqual(mockRecipe);
    expect(repository.create).toHaveBeenCalledWith(mockRecipe);
    expect(repository.save).toHaveBeenCalledWith(mockRecipe);
  });

  it('should update a recipe', async () => {
    const updatedRecipe = { ...mockRecipe, name: 'Updated Pizza' };
    jest.spyOn(repository, 'findOne').mockResolvedValue(updatedRecipe);

    const result = await service.update(1, updatedRecipe);
    expect(result).toEqual(updatedRecipe);
    expect(repository.update).toHaveBeenCalledWith(1, updatedRecipe);
    expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should delete a recipe', async () => {
    await service.delete(1);
    expect(repository.delete).toHaveBeenCalledWith(1);
  });
});