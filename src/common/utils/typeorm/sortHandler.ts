import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';



export function sortHandler(dto: any, table: any, query: any) {

  if (dto.sort) {
    try {

      if (typeof (dto.sort) == 'string') {
        const sortString = dto.sort as unknown as string
        const sortArr = sortString.split(',')

        query.orderBy(`${table}.${sortArr[0]}`, <'ASC' | 'DESC'>sortArr[1])
      }

      else if (typeof (dto.sort) == 'object') {
        for (let sortKey in dto.sort as object) {
          const sortString = dto.sort[sortKey]
          const sortArr = sortString.split(',')

          query.orderBy(`${table}.${sortArr[0]}`, <'ASC' | 'DESC'>sortArr[1])
        }
      }

    }
    catch {
      throw new NotFoundException('Invalid sort params.')
    }
  }
  else {
    query.orderBy(`${table}.id`, 'ASC')
  }


  return query
}