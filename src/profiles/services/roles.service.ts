import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { fieldsHandler } from '../../common/utils/typeorm/fieldsHandler.js';
import { searchHandler } from '../../common/utils/typeorm/searchHandler.js';
import { filterHandler } from '../../common/utils/typeorm/filterHandler.js';
import { sortHandler } from '../../common/utils/typeorm/sortHandler.js';
import { joinHandler } from '../../common/utils/typeorm/joinHandler.js';

import { Roles, Users } from '../entities/profiles.entity.js';

//
import { QueryBulkDto, QueryDto } from '../../common/dto/query.dto.js'

import {
  ProfilesReadRoleDto, ProfilesCreateRoleDto, ProfilesReadRoleBulkDto, ProfilesUpdateRoleDto, ProfilesDeleteRoleDto
} from '../dto/roles.dto.js';



// create bulk example
// async createMany(createUserDtos: Array<CreateUserDto>) {
//   return { createUserDtos }
// }



@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
  ) { }


  async create(dto: ProfilesCreateRoleDto) {
    const role = await this.rolesRepository.save(dto)
    return role
  }



  async findAll(dto: QueryBulkDto, isDeleted: boolean = false) {
    //
    const repo = this.rolesRepository
    const alias = 'roles'

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
    const repo = this.rolesRepository
    const alias = 'roles'

    //
    let query = repo.createQueryBuilder(alias)
      .where(`${alias}.id = :id`, { id: id })
      .andWhere(`${alias}.deleted = :deleted`, { deleted: isDeleted })


    // params from query
    query = fieldsHandler(dto, alias, query)
    query = joinHandler(dto, alias, query)


    //
    const data = await query.getOne()
    if (!data) { throw new NotFoundException() }

    return data;
  }




  async update(id: number, dto: ProfilesUpdateRoleDto) {

    const role = await this.rolesRepository.findOne({
      where: { id: id, deleted: false }
    })
    if (!role) { throw new NotFoundException() }

    const roleUpdate = await this.rolesRepository.save({ id, ...dto })
    const roleUpdated = await this.rolesRepository.findOne({
      where: { id: id }
    })

    return roleUpdated
  }



  async updateDeleted(id: number, dto: ProfilesDeleteRoleDto) {

    const role = await this.rolesRepository.findOne({
      where: { id: id, deleted: true }
    })
    if (!role) { throw new NotFoundException() }

    const roleUpdate = await this.rolesRepository.save({ id, ...dto })
    const roleUpdated = await this.rolesRepository.findOne({
      where: { id: id }
    })

    return roleUpdated
  }



  async remove(id: number) {

    const role = await this.rolesRepository.findOne({
      where: { id: id, deleted: false }
    })
    if (!role) { throw new NotFoundException() }

    const roleUpdate = await this.rolesRepository.save({ id, deleted: true })
    const roleUpdated = await this.rolesRepository.findOne({
      where: { id: id }
    })

    return roleUpdated
  }

}