import { 
  Controller, UsePipes, ValidationPipe, ParseArrayPipe, UseGuards,
  Get, Post, Body, Request, Query, Patch, Param, Delete
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles-auth.guard';
import { RolesAuth } from "../auth/roles-auth.decorator";

//
import { QueryBulkDto, QueryDto } from '../common/dto/query.dto.js'
import { 
  ProfilesReadRoleDto, ProfilesCreateRoleDto, ProfilesReadRoleBulkDto, ProfilesUpdateRoleDto, ProfilesDeleteRoleDto 
} from './dto/roles.dto';
import { 
  ProfilesReadUserDto, ProfilesCreateUserDto, ProfilesReadUserBulkDto, ProfilesUpdateUserDto, ProfilesDeleteUserDto 
} from './dto/users.dto';

//
import { RolesService } from './services/roles.service';
import { UsersService } from './services/users.service';


@ApiTags('Profiles Roles')
@Controller('profiles/roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Create one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadRoleDto})
  create(@Body() dto: ProfilesCreateRoleDto) {
    return this.rolesService.create(dto);
  }
  
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiOperation({summary:'Get many'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: [ProfilesReadRoleBulkDto]})
  findAll(@Query() dto: QueryBulkDto){
    return this.rolesService.findAll(dto);
  }
  
  @Get('deleted')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiOperation({summary:'Get many deleted'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: [ProfilesReadRoleBulkDto]})
  findAllDeleted(@Query() dto: QueryBulkDto) {
    return this.rolesService.findAll(dto, true);
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({summary:'Get one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadRoleDto})
  findOne(@Param('id') id: string, @Query() dto: QueryDto) {
    return this.rolesService.findOne(+id, dto);
  }
  
  @Get('deleted/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @ApiOperation({summary:'Get one from deleted'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadRoleDto})
  findOneDeleted(@Param('id') id: string, @Query() dto: QueryDto) {
    return this.rolesService.findOne(+id, dto, true);
  }
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Path one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadRoleDto})
  update(@Param('id') id: string, @Body() dto: ProfilesUpdateRoleDto) {
    return this.rolesService.update(+id, dto);
  }
  
  @Patch('deleted/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Undelete one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadRoleDto})
  updateDeleted(@Param('id') id: string, @Body() dto: ProfilesDeleteRoleDto) {
    return this.rolesService.updateDeleted(+id, dto);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @ApiOperation({summary:'Delete one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadRoleDto})
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}


@ApiTags('Profiles Users')
@Controller('profiles/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Create one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadUserDto})
  create(@Body() dto: ProfilesCreateUserDto) {
    return this.usersService.create(dto);
  }
  
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiOperation({summary:'Get many'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: [ProfilesReadUserBulkDto]})
  findAll(@Query() dto: QueryBulkDto) {
    return this.usersService.findAll(dto);
  }
  
  @Get('/deleted')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe({transform: true}))
  @ApiOperation({summary:'Get many deleted'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: [ProfilesReadUserBulkDto]})
  findAllDeleted(@Query() dto: QueryBulkDto) {
    return this.usersService.findAll(dto, true);
  }
  
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({summary:'Get one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadUserDto})
  findOne(@Param('id') id: string, @Query() dto: QueryDto) {
    return this.usersService.findOne(+id, dto);
  }
  
  @Get('deleted/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @ApiOperation({summary:'Get one deleted'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadUserDto})
  findOneDeleted(@Param('id') id: string, @Query() dto: QueryDto) {
    return this.usersService.findOne(+id, dto, true);
  }
  
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Path one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadUserDto})
  update(@Param('id') id: string, @Body() dto: ProfilesUpdateUserDto) {
    return this.usersService.update(+id, dto);
  }
  
  @Patch('deleted/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @UsePipes(new ValidationPipe())
  @ApiOperation({summary:'Undelete one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadUserDto})
  updateDeleted(@Param('id') id: string, @Body() dto: ProfilesDeleteUserDto) {
    return this.usersService.updateDeleted(+id, dto);
  }
  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @RolesAuth('moderator')
  @ApiOperation({summary:'Delete one'})
  @ApiBearerAuth()
  @ApiResponse({status:200, type: ProfilesReadUserDto})
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}