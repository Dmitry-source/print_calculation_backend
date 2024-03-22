
import { 
  Controller, Get, Post, HttpCode, Body, Patch, Param, Delete, 
  UseGuards, Request, UsePipes, ValidationPipe 
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

//
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';


import { AuthRegByEmailDto,  AuthSuccessDto } from './dto/auth.dto';



@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //// Registration
  // by email
  @Post('registration/email')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Final Registration by Email'})
  @ApiResponse({status:201, type: AuthSuccessDto})
  regByEmail(@Body() authRegByEmailDto: AuthRegByEmailDto) {
    return this.authService.regWithEmailAndPhone(authRegByEmailDto);
  }

  //// Login
  // login by email
  @Post('login/email')
  @HttpCode(200)
  @ApiOperation({summary:'Login by Email'})
  @ApiBody({
    schema:{
      example: { email:"Sunrise55g@gmail.com", password:"SSRlasp55g" }
    }
  })
  @ApiResponse({status:200, type: AuthSuccessDto})
  async loginByEmail(@Body() body) {
    return this.authService.loginByEmail(body.email, body.password);
  }


  // login by username
  @Post('login/username')
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiOperation({summary:'Login by Username'})
  @ApiBody({
    schema:{
      example: { username:"Sunrise55g", password:"SSRlasp55g" }
    }
  })
  @ApiResponse({status:200, type: AuthSuccessDto})
  async loginByUsername(@Request() req) {
    return this.authService.loginByUsername(req.user);
  }



  // work for tokens
  @UseGuards(JwtAuthGuard)
  @Get('refresh')
  @ApiOperation({summary:'Refresh token'})
  @ApiBearerAuth()
  @ApiResponse({
    status:200, 
    schema:{
      example:{ token:"8753r349jgu3^G&H83qju27fn8um" }
    }
  })
  refresh(@Request() req) {
    return this.authService.refresh(req.user);
  }


  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @ApiOperation({summary:'Verify token'})
  @ApiBearerAuth()
  @ApiResponse({
    status:200, 
    schema:{
      example:{ verify:true }
    }
  })
  verify(@Request() req) {
    return this.authService.verify(req.user);
  }

}