// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsNumber, MinLength,
  Min, Max,
  IsPhoneNumber
} from 'class-validator';

import { ProfilesReadRoleDto } from './roles.dto';


export class ProfilesCreateUserDto {
    @IsOptional()
    @ApiProperty({ example: 'Sunrise55g', description: 'Username' })
    username: string
  
    @IsOptional()
    @MinLength(5, { message: 'Password must be more 5 symbols!' })
    @ApiProperty({ example: 'Password', description: 'Password' })
    password: string
  
    @IsOptional()
    @IsEmail()
    @ApiProperty({ example: 'Sunrise55g@gmail.com', description: 'Email' })
    email: string
  
    @IsOptional()
    @IsPhoneNumber()
    @ApiProperty({ example: '+79372014434', description: 'Phone number' })
    phone: string
  
    @IsOptional()
    @ApiProperty({ example: "Sunrise", description: 'First name', required: false })
    firstName: string
  
    @IsOptional()
    @ApiProperty({ example: "Wind", description: 'Last name', required: false })
    lastName: string
  
    //
    @IsOptional()
    @ApiProperty({ example: true, description: 'Active status', required: false })
    active: boolean
  
  
    //
    @IsOptional()
    @ApiProperty({ example: 1, description: 'Role id', required: false })
    roleId: number
  }
  
  
  
  export class ProfilesReadUserDto {
    @ApiProperty({ example: 1, description: 'Primary key' })
    id: number
  
    @ApiProperty({ example: 'Sunrise55g', description: 'Username' })
    username: string
  
    @IsEmail()
    @ApiProperty({ example: 'Sunrise55g@gmail.com', description: 'Email' })
    email: string
  
    @IsPhoneNumber()
    @ApiProperty({ example: '+79372014434', description: 'Phone number' })
    phone: string
  
    @ApiProperty({ example: "Link", description: 'Avatar Link', required: false })
    avatar: string
  
    @ApiProperty({ example: "Sunrise", description: 'First name', required: false })
    firstName: string
  
    @ApiProperty({ example: "Wind", description: 'Last name', required: false })
    lastName: string
  
    @ApiProperty({ example: '2024-01-05T20:44:19.360Z', description: 'First Seen', required: false })
    firstSeen: Date
  
    @ApiProperty({ example: '2024-01-05T20:44:19.360Z', description: 'Last Seen', required: false })
    lastSeen: Date
  
    //
    @ApiProperty({ example: true, description: 'Active status', required: false })
    active: boolean
  
    @ApiProperty({ example: false, description: 'Delete status', required: false })
    deleted: boolean
  
    @ApiProperty({ example: '2024-01-05T20:44:19.360Z', description: 'createdAt' })
    createdAt: Date
  
    @ApiProperty({ example: '2024-01-05T20:44:19.360Z', description: 'updatedAt' })
    updatedAt: Date
  
  
    //
    @ApiProperty({ example: 1, description: 'Role id', required: false })
    roleId: number
  
    @ApiProperty({ type: ProfilesReadRoleDto })
    roles: ProfilesReadRoleDto
  }
  
  
  export class ProfilesReadUserBulkDto {
    @ApiProperty({ type: ProfilesReadUserDto })
    data: ProfilesReadUserDto
  
    @ApiProperty({ example: '10', description: 'Count on page' })
    count: number
  
    @ApiProperty({ example: '100', description: 'Total count' })
    total: number
  
    @ApiProperty({ example: '1', description: 'Page number' })
    page: number
  
    @ApiProperty({ example: '0', description: 'Page count' })
    pageCount: number
  }
  
  
  export class ProfilesUpdateUserDto extends PartialType(ProfilesCreateUserDto) { }
  
  export class ProfilesDeleteUserDto {
    @IsNotEmpty()
    @ApiProperty({ example: false, description: 'Delete status' })
    deleted: boolean
  }