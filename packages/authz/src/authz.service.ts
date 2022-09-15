import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthzService {
  getHello(): string {
    return 'Hello World!';
  }
}
