import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  // Mock de Recipe con todas las propiedades requeridas
  const mockRecipe: Recipe = {
    id: 1,
    name: 'Pizza',
    ingredient: 'cheese',
    quantity: 2,
  };

  const mockRecipesService = {
    findall: jest.fn().mockResolvedValue([mockRecipe]),
    findOne: jest.fn().mockResolvedValue(mockRecipe),
    create: jest.fn().mockResolvedValue(mockRecipe),
    update: jest.fn().mockResolvedValue({ ...mockRecipe, name: 'Updated Pizza' }),
    delete: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [{ provide: RecipesService, useValue: mockRecipesService }],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should return all recipes', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockRecipe]);
    expect(service.findall).toHaveBeenCalled();
  });

  it('should return one recipe', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockRecipe);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should throw if recipe not found (findOne)', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
    await expect(controller.findOne(99)).rejects.toThrow('Recipe not found');
  });

  it('should create a recipe', async () => {
    const result = await controller.create(mockRecipe);
    expect(result).toEqual(mockRecipe);
    expect(service.create).toHaveBeenCalledWith(mockRecipe);
  });

  it('should update a recipe', async () => {
    const updated = await controller.update(1, mockRecipe);
    expect(updated.name).toBe('Updated Pizza');
    expect(service.update).toHaveBeenCalledWith(1, mockRecipe);
  });

  it('should delete a recipe', async () => {
    await controller.delete(1);
    expect(service.findOne).toHaveBeenCalledWith(1);
    expect(service.delete).toHaveBeenCalledWith(1);
  });

  it('should throw if recipe not found (delete)', async () => {
    jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);
    await expect(controller.delete(999)).rejects.toThrow('Recipe not found');
  });
});