// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, ApiQuery, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsNumber, MinLength,
  Min, Max
} from 'class-validator';


export class ProfilesCreateRoleDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'Moderator', description: 'Name of role' })
    name: string
  
    @IsOptional()
    @ApiProperty({ example: 'This is moderator', description: 'Role description', required: false })
    description: string
  
    @IsBoolean()
    @ApiProperty({ example: true, description: 'Administrator privilegies' })
    administrator: boolean
  
    @IsBoolean()
    @ApiProperty({ example: false, description: 'Moderator privilegies' })
    moderator: boolean
  
    //
    @IsOptional()
    @ApiProperty({ example: true, description: 'Active status', required: false })
    active: boolean
  }
  
  
  export class ProfilesReadRoleDto {
    @ApiProperty({ example: 1, description: 'Primary key' })
    id: number
  
    @ApiProperty({ example: 'Moderator', description: 'Name of role' })
    name: string
  
    @ApiProperty({ example: 'This is moderator', description: 'Role description', required: false })
    description: string
  
    @ApiProperty({ example: true, description: 'Administrator privilegies' })
    administrator: boolean
  
    @ApiProperty({ example: false, description: 'Moderator privilegies' })
    moderator: boolean
  
    //
    @ApiProperty({ example: true, description: 'Active status', required: false })
    active: boolean
  
    @ApiProperty({ example: false, description: 'Delete status' })
    deleted: boolean
  
    @ApiProperty({ example: '2024-01-05T20:44:19.360Z', description: 'createdAt' })
    createdAt: Date
  
    @ApiProperty({ example: '2024-01-05T20:44:19.360Z', description: 'updatedAt' })
    updatedAt: Date
  }
  
  
  export class ProfilesReadRoleBulkDto {
    @ApiProperty({ type: ProfilesReadRoleDto })
    data: ProfilesReadRoleDto
  
    @ApiProperty({ example: '10', description: 'Count on page' })
    count: number
  
    @ApiProperty({ example: '100', description: 'Total count' })
    total: number
  
    @ApiProperty({ example: '1', description: 'Page number' })
    page: number
  
    @ApiProperty({ example: '0', description: 'Page count' })
    pageCount: number
  }
  
  
  export class ProfilesUpdateRoleDto extends PartialType(ProfilesCreateRoleDto) { }
  
  export class ProfilesDeleteRoleDto {
    @IsNotEmpty()
    @ApiProperty({ example: false, description: 'Delete status' })
    deleted: boolean
  }