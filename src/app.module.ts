import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Recipe } from './recipes/recipe.entity';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { RecipesModule } from './recipes/recipes.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';
dotenv.config();
console.log('DB_TYPE:', process.env.DB_TYPE); // Verificar si la variable DB_TYPE está cargada correctamente
console.log('PG_HOST:', process.env.PG_HOST); // Verificar la variable PG_HOST
console.log('PG_PORT:', process.env.PG_PORT); // Verificar la variable PG_PORT

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    RecipesModule,
    TypeOrmModule.forRoot({
      type: process.env.DB_TYPE as any,
      host: process.env.PG_HOST,
      port: parseInt(process.env.PG_PORT),
      username: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DB,
      entities: [User, Recipe],//entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    UsersModule, RecipesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
