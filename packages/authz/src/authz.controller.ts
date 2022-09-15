import { Controller, Get } from '@nestjs/common';
import { AuthzService } from './authz.service';

@Controller()
export class AuthzController {
  constructor(private readonly authzService: AuthzService) { }

  @Get()
  getHello(): string {
    return this.authzService.getHello();
  }
}
