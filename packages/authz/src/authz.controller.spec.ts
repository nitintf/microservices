import { Test, TestingModule } from '@nestjs/testing';
import { AuthzController } from './authz.controller';
import { AuthzService } from './authz.service';

describe('AuthzController', () => {
  let authzController: AuthzController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AuthzController],
      providers: [AuthzService],
    }).compile();

    authzController = app.get<AuthzController>(AuthzController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(authzController.getHello()).toBe('Hello World!');
    });
  });
});
