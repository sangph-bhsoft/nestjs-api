import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    const jav = 'Trang cute';
    return jav;
  }
}
