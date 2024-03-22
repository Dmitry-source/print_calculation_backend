import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../profiles/services/users.service';
import { IUser } from './types/auth.types';
import { AuthRegByEmailDto, AuthSuccessDto } from './dto/auth.dto';



@Injectable()
export class AuthService {

  constructor(
    //
    private readonly jwtService: JwtService,
    //
    private usersService: UsersService,
  ) { }



  async validateUser(username: string, password: string): Promise<any> {

    let user = await this.usersService.findOneByLogin(username);

    if (!user) {
      throw new UnauthorizedException('User not found!');
    }
    if (user.deleted == true) {
      throw new NotFoundException('User is deleted!');
    }
    if (user.active == false) {
      throw new UnauthorizedException('User is not active!');
    }

    let passwordIsMatch = await argon2.verify(user.passwordHash, password)

    if (user && passwordIsMatch) {
      const { passwordHash, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('User or password are incorrect!')
  }


  //// Registration

  // by email
  
  async regWithEmailAndPhone(dto: AuthRegByEmailDto) {

    //
    const existUser = await this.usersService.findOneByLogin(dto.username)
    if (existUser) throw new BadRequestException('This username is already exist!')

    const existEmail = await this.usersService.findOneByEmail(dto.email)
    if (existEmail) throw new BadRequestException('User with this Email is already exist!')

    const existPhone = await this.usersService.findOneByPhone(dto.phone)
    if (existPhone) throw new BadRequestException('User with this Phone is already exist!')


    //
    if (!dto.username){
      if (dto.email){
        dto.username = dto.email
      }
      else if (dto.phone){
        dto.username = dto.phone
      }
    }


    //
    const user = await this.usersService.createFromRegistration(dto)

    //
    const token = this.jwtService.sign({ id: user.id, username: user.username })

    const result = {
      'user': user,
      'token': token
    }

    return result;
  }




  //// Login

  // login by email
  async loginByEmail(email: string, password: string): Promise<any> {

    let user = await this.usersService.findOneByEmail(email);

    //
    if (!user) { throw new UnauthorizedException('User not found!') }
    if (user.deleted == true) { throw new NotFoundException('User is deleted!') }
    if (user.active == false) { throw new UnauthorizedException('User is not active!') }

    //
    let passwordIsMatch = await argon2.verify(user.passwordHash, password)

    if (user && passwordIsMatch) {

      const { passwordHash, ...userData } = user;
      const token = this.jwtService.sign({ id: user.id, username: user.username })

      const result = { userData, token }
      return result;
    }

    throw new UnauthorizedException('Email or password are incorrect!')
  }



  // login by username
  async loginByUsername(user: IUser) {

    const { id, username } = user
    const token = this.jwtService.sign({ id: user.id, username: user.username })

    const result = { user, token }
    return result
  }


  //
  async refresh(user: IUser) {

    const { id, username } = user
    const token = this.jwtService.sign({ id: user.id, username: user.username })

    const result = { "token": token }
    return result
  }


  async verify(user: IUser) {
    const result = { "verify": true }
    return result
  }

}
