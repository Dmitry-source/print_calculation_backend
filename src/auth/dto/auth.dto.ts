export class CreateAuthDto {}

import { PartialType } from '@nestjs/mapped-types';

import {
    IsBoolean, IsDateString, IsEmail,
    IsNotEmpty, IsOptional, IsPhoneNumber, MinLength,
    ValidateNested
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';


//
import { ProfilesReadUserDto } from 'src/profiles/dto/users.dto';

export class AuthRegByEmailDto {

    @IsOptional()
    @ApiProperty({ example: 'Sunrise55g', description: 'Username', required: false })
    username: string

    @MinLength(5, { message: 'Password must be more 5 symbols!' })
    @ApiProperty({ example: 'Password', description: 'Password' })
    password: string

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'Sunrise55g@gmail.com', description: 'Email' })
    email: string

    @IsPhoneNumber()
    @IsOptional()
    @ApiProperty({ example: '+79372014434', description: 'Phone number', required: false })
    phone: string

    @IsOptional()
    @ApiProperty({ example: "Sunrise", description: 'First name', required: false })
    firstName: string

    @IsOptional()
    @ApiProperty({ example: "Wind", description: 'Last name', required: false })
    lastName: string
}


//// Auth Success Universal
export class AuthSuccessDto {

    @IsNotEmpty()
    @ApiProperty({ type: ProfilesReadUserDto })
    readonly user: ProfilesReadUserDto;

    @IsNotEmpty()
    @ApiProperty({ example: '837429fj9384t348728324', description: 'Token' })
    readonly token: string
}