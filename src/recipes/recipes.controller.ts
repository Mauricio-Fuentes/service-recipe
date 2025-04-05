import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipe.entity';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  //get all recipes
  @Get()
  async findAll(): Promise<Recipe[]> {
    return await this.recipesService.findall();
  }

  //get one recipe
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Recipe> {
    const recipe = await this.recipesService.findOne(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    } else {
      return recipe;
    }
  }

  //create recipe
  @Post()
  async create(@Body() recipe: Recipe): Promise<Recipe> {
    return await this.recipesService.create(recipe);
  }

  //update recipe
  @Put(':id')
  async update(@Param('id') id: number, @Body() recipe: Recipe): Promise<Recipe> {
    return this.recipesService.update(id, recipe);
  }

  //delete recipe
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    //handle the error if recipe not found
    const recipe = await this.recipesService.findOne(id);
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return this.recipesService.delete(id);
  }
}
