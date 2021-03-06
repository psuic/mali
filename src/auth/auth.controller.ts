import { NextFunction, Request, Response } from 'express';
import { Controller, Use, Post, StatusCodes, validateType, HttpException, responseFormat, Get} from '@mildjs/core';

import { CreateUserDto } from '../users/dtos/users.dto';
import { UsersEntity } from '../users/users.entity';

import { AuthService } from './auth.service';
import { isAuth, isRole } from './auth.middleware';
import { UsersService } from '../users/users.service';
import { isEmptyObject } from '../app/util';
import * as jwt from 'jsonwebtoken';
import { vars } from '../app/config';
import { DataStoredInToken, RequestWithUser } from './auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private userService: UsersService) {}

  @Use(validateType(CreateUserDto))
  @Post('signup')
  public async signUp(req: Request, res: Response) {
    const userData: CreateUserDto = req.body;
    const signUpUserData: UsersEntity = await this.userService.create(userData);
    responseFormat(res, { data: signUpUserData });
  }

  @Use(validateType(CreateUserDto))
  @Post('login')
  public async logIn(req: Request, res: Response) {
    const userData: CreateUserDto = req.body;

    const findUser: UsersEntity = await this.userService.findByEmail(userData.username);
    if (!findUser) throw new HttpException(409, `You're username ${userData.username} not found`);

    const isPasswordMatching: boolean = userData.password === findUser.password;
    if (!isPasswordMatching) throw new HttpException(409, `The password is incorrect`);

    const { token, user } = await this.authService.login(findUser);
    let data;
    if (user && user.password === userData.password) {
      const { password, ...result } = user;
      data = result;
    }
    responseFormat(res, {
      data: { user, authorization: token },
    });
  }

  @Use(isAuth)
  @Post('logout')
  public async logOut(req: Request, res: Response) {
    responseFormat(res, { message: 'logout' });
  }

  @Post('test')
  @Use(isRole())
  public async testAuth(req: RequestWithUser, res: Response) {
    if (!req.user) new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token');
    responseFormat(res, { message: `Hi ${req.user.username}` });
  }

  @Post('test-role')
  @Use(isRole('student'))
  public async testRole(req: RequestWithUser, res: Response) {
    if (!req.user) new HttpException(StatusCodes.UNAUTHORIZED, 'Wrong authentication token');
    responseFormat(res, { message: `Hi ${req.user.username}` });
  }

  @Get('test-auth')
  public async testttt(req: Request, res: Response) {
    responseFormat(res, {});
  }
}
