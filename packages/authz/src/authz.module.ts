import { Module } from '@nestjs/common';
import { AuthzController } from './authz.controller';
import { AuthzService } from './authz.service';

@Module({
  imports: [],
  controllers: [AuthzController],
  providers: [AuthzService],
})
export class AuthzModule { }
