import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EOperator, IOperator, ECondition, ICondition } from './types';
import { queryFormer } from './queryFormer';



export function joinHandler(dto: any, table: any, query: any) {

  if (dto.join) {
    // console.log('Start joinHandler')

    const deletedRelations = dto.deletedRelations

    // join string
    if (typeof (dto.join) == 'string') {

      const joinString = dto.join as unknown as string
      const joinArr = joinString.split('||')

      //
      joinArrHandler(joinArr, deletedRelations)
    }

    // join obj
    else if (typeof (dto.join) == 'object') {
      for (let dtoJoinKeys in dto.join as object) {
        const joinString = dto.join[dtoJoinKeys] as unknown as string
        const joinArr = joinString.split('||')

        //
        joinArrHandler(joinArr, deletedRelations)
      }
    }

  }


  function joinArrHandler(joinArr: any, deletedRelations: boolean) {
    //
    let relations: string
    if (joinArr[0]) {
      relations = joinArr[0]
    }
    // console.log(relations)

    //
    let fields: any
    if (joinArr[1]) {
      fields = joinArr[1].split(',')
      for (const key in fields) {
        fields[key] = `${relations}.${fields[key]}`
      }
    }
    // console.log(fields)

    //
    try {

      if (fields) {

        if (deletedRelations === true) {
          query.leftJoin(`${table}.${relations}`, relations)
        }
        else {
          query.leftJoin(
            `${table}.${relations}`, relations, 
            `${relations}.deleted = :${relations}Deleted`, { [`${relations}Deleted`]: false }
          )
        }


        query
          .addSelect(fields);

      }
      else {

        if (deletedRelations === true) {
          query.leftJoinAndSelect(`${table}.${relations}`, relations)
        }
        else {
          query.leftJoinAndSelect(
            `${table}.${relations}`, relations, 
            `${relations}.deleted = :${relations}Deleted`, { [`${relations}Deleted`]: false }
          )
        }


      }

    }
    catch {
      throw new BadRequestException(`Join parameters error.`)
    }

  }


  return query
}