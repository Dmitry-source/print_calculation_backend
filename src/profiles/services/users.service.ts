import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as argon2 from 'argon2';


//
import { fieldsHandler } from '../../common/utils/typeorm/fieldsHandler.js';
import { searchHandler } from '../../common/utils/typeorm/searchHandler.js';
import { filterHandler } from '../../common/utils/typeorm/filterHandler.js';
import { sortHandler } from '../../common/utils/typeorm/sortHandler.js';
import { joinHandler } from '../../common/utils/typeorm/joinHandler.js';

//
import { Roles, Users } from '../entities/profiles.entity.js';

//
import { QueryBulkDto, QueryDto } from '../../common/dto/query.dto.js'

import {
  ProfilesReadUserDto, ProfilesCreateUserDto, ProfilesReadUserBulkDto, ProfilesUpdateUserDto, ProfilesDeleteUserDto
} from '../dto/users.dto.js';


// create bulk example
// async createMany(createUserDtos: Array<CreateUserDto>) {
//   return { createUserDtos }
// }





@Injectable()
export class UsersService {
  constructor(
    //
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    @InjectRepository(Users) private usersRepository: Repository<Users>,
    //
   
  ) {}


  // for auth module

  async findOneByLogin(username: string) {
    const user = await this.usersRepository
      .createQueryBuilder("users")
      .addSelect('users.passwordHash')
      .where("users.username = :username", { username: username })
      .leftJoinAndSelect(
        'users.roles', 'roles', `roles.deleted = :rolesDeleted`, 
        { rolesDeleted: false }
      )
      .getOne()

    return user
  }


  async findOneByEmail(email: string) {
    const user = await this.usersRepository
      .createQueryBuilder("users")
      .addSelect('users.passwordHash')
      .where("users.email = :email", { email: email })
      .leftJoinAndSelect(
        'users.roles', 'roles', `roles.deleted = :rolesDeleted`, 
        { rolesDeleted: false }
      )
      .getOne()

    return user
  }


  async findOneByPhone(phone: string) {
    const user = await this.usersRepository
      .createQueryBuilder("users")
      .addSelect('users.passwordHash')
      .where("users.phone = :phone", { phone: phone })
      .leftJoinAndSelect(
        'users.roles', 'roles', `roles.deleted = :rolesDeleted`, 
        { rolesDeleted: false }
      )
      .getOne()

    return user
  }



  async createFromRegistration(dto: any) {

    let incomingPasswordHash:string

    if (dto.password){
      incomingPasswordHash = await argon2.hash(dto.password)
    }

    const user = await this.usersRepository.save({
      username: dto.username,
      email: dto.email,
      phone: dto.phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: incomingPasswordHash
    })

    const { passwordHash, ...dataAdded } = user;

    return dataAdded;
  }


  
  //
  async create(dto: ProfilesCreateUserDto) {

    if (dto.roleId) {
      const role = await this.rolesRepository.findOne({
        where: { id: dto.roleId, deleted: false }
      })
      if (!role) { throw new BadRequestException({ message: 'Role with this roleId not found' }) }
    }

    if (dto.username) {
      const existLogin = await this.usersRepository.findOne({
        where: { username: dto.username }
      })
      if (existLogin) { throw new BadRequestException({ message: 'User with this Username is exist.' }) }
    }

    if (dto.email) {
      const existEmail = await this.usersRepository.findOne({
        where: { email: dto.email }
      })
      if (existEmail) { throw new BadRequestException({ message: 'User with this Email is exist.' }) }
    }


    const { password, ...dataAdded } = dto
    const user = await this.usersRepository.save({
      ...dataAdded,
      passwordHash: await argon2.hash(password)
    })
    
    const result = {
      'user': dataAdded
    }
    return result;
  }


async findAll(dto: QueryBulkDto, isDeleted: boolean = false) {
    //
    const repo = this.usersRepository
    const alias = 'users'

    //
    let query = repo.createQueryBuilder(alias)
      .where(`${alias}.deleted = :deleted`, { deleted: isDeleted })


    // params from query
    query = fieldsHandler(dto, alias, query)
    query = searchHandler(dto, alias, query)
    query = filterHandler(dto, alias, query)
    query = sortHandler(dto, alias, query)
    query = joinHandler(dto, alias, query)


    // pagination
    const total = await query.getCount()
    const limit = dto.limit
    let offset = dto.offset
    let page = dto.page


    const pageCount = Math.ceil(total / limit)
    if (page < 1) { dto.page = 1 }
    if (page > pageCount) { page = pageCount }

    if (page > 0) {
      offset = limit * (page - 1)
    }

    query.skip(offset).take(limit)


    //
    if (!dto.join) {
      if (dto.deletedRelations == true) {
        query.leftJoinAndSelect('users.roles', 'roles')
      }
      else {
        query.leftJoinAndSelect('users.roles', 'roles', `roles.deleted = :rolesDeleted`, { rolesDeleted: false })
      }
    }


    //
    const data = await query.getMany()
    const count = data.length

    //
    const result = {
      'data': data,
      'count': count,
      'total': total,
      'page': page,
      'pageCount': pageCount
    }
    return result;
  }




  async findOne(id: number, dto: QueryDto, isDeleted: boolean = false) {
    //
    const repo = this.usersRepository
    const alias = 'users'

    //
    let query = repo.createQueryBuilder(alias)
      .where(`${alias}.id = :id`, { id: id })
      .andWhere(`${alias}.deleted = :deleted`, { deleted: isDeleted })


    // params from query
    query = fieldsHandler(dto, alias, query)
    query = joinHandler(dto, alias, query)


    //
    if (!dto.join) {
      if (dto.deletedRelations == true) {
        query.leftJoinAndSelect('users.roles', 'roles')
      }
      else {
        query.leftJoinAndSelect('users.roles', 'roles', `roles.deleted = :rolesDeleted`, { rolesDeleted: false })
      }
    }


    //
    const data = await query.getOne()
    if (!data) { throw new NotFoundException() }

    return data;
  }




  async update(id: number, profilesUpdateUserDto: ProfilesUpdateUserDto) {

    if (profilesUpdateUserDto.roleId) {
      const category = await this.rolesRepository.findOne({
        where: { id: profilesUpdateUserDto.roleId, deleted: false }
      })
      if (!category) { throw new BadRequestException({ message: 'Role with this roleId not found' }) }
    }

    const user = await this.usersRepository.findOne({
      where: { id: id, deleted: false }
    })
    if (!user) { throw new NotFoundException() }


    if (profilesUpdateUserDto.username) {
      if (profilesUpdateUserDto.username !== user.username) {
        const existLogin = await this.usersRepository.findOne({
          where: { username: profilesUpdateUserDto.username }
        })
        if (existLogin) { throw new BadRequestException({ message: 'User with this Username is exist.' }) }
      }
    }

    if (profilesUpdateUserDto.email) {
      if (profilesUpdateUserDto.email !== user.email) {
        const existEmail = await this.usersRepository.findOne({
          where: { email: profilesUpdateUserDto.email }
        })
        if (existEmail) { throw new BadRequestException({ message: 'User with this Email is exist.' }) }
      }
    }


    let updateUserData: any
    if (profilesUpdateUserDto.password) {
      const { password, ...updateData } = profilesUpdateUserDto
      const passwordHash = await argon2.hash(password)
      updateUserData = { passwordHash, ...updateData }
    }
    else {
      updateUserData = profilesUpdateUserDto
    }

    //
    const userUpdate = await this.usersRepository.save({ id, ...updateUserData })
    const userUpdated = await this.usersRepository.findOne({
      where: { id: id },
      relations: {
        roles: true
      },
    })

    return userUpdated
  }



  async updateDeleted(id: number, profilesDeleteUserDto: ProfilesDeleteUserDto) {

const user = await this.usersRepository.findOne({
      where: { id: id, deleted: true },
      relations: { "roles": true },
    })
    if (!user) { throw new NotFoundException() }

    //
    const userUpdate = await this.usersRepository.save({ id, ...profilesDeleteUserDto })
    const userUpdated = await this.usersRepository.findOne({
      where: { id: id },
      relations: {
        roles: true
      },
    })


    return userUpdated
  }



  async remove(id: number) {

    let user = await this.usersRepository.findOne({
      where: { id: id, deleted: false },
      relations: { "roles": true },
    })
    if (!user) { throw new NotFoundException() }

    //
    const userUpdate = await this.usersRepository.save({ id, deleted: true })
    const userUpdated = await this.usersRepository.findOne({
      where: { id: id },
      relations: {
        roles: true
      },
    })

    return userUpdated
  }



}