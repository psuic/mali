import { Module } from '@mildjs/core';
import { UsersService } from '../users/users.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService],
})
export class AuthModule {}
