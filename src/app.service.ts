import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  
  getHealthcheck(): string {
    return 'Service Up!';
  }
}
