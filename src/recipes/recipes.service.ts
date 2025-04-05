import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from './recipe.entity';

@Injectable()
export class RecipesService {
  constructor(
    @InjectRepository(Recipe)
    private recipesRepository: Repository<Recipe>,
  ) {}

  // get all recipes
  async findall(): Promise<Recipe[]> {
    return await this.recipesRepository.find();
  }

  // get one recipe
  async findOne(id: number): Promise<Recipe> {
    return await this.recipesRepository.findOne({ where : { id } });
  }

  //create recipe
  async create(recipe: Recipe): Promise<Recipe> {
    const newRecipe = this.recipesRepository.create(recipe);
    return await this.recipesRepository.save(newRecipe);
  }

  // update recipe
  async update(id: number, recipe: Recipe): Promise<Recipe> {
    await this.recipesRepository.update(id, recipe);
    return await this.recipesRepository.findOne( { where : { id } } );
  }

  // delete recipe
  async delete(id: number): Promise<void> {
    await this.recipesRepository.delete(id);
  }
}
