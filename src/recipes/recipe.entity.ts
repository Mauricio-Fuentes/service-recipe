import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name : string;

  @Column()
  ingredient: string;

  @Column()
  quantity: number;
}