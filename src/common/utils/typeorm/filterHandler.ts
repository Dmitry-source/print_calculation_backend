import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { EOperator, IOperator, ECondition, ICondition } from './types';
import { queryFormer } from './queryFormer';



export function filterHandler(dto: any, table: any, query: any) {

  if (!dto.s && (dto.filter || dto.or)) {
    // console.log('Start filterHandler')
    let subQ = []


    // filter string
    if (typeof (dto.filter) == 'string') {

      const filterString = dto.filter as unknown as string
      const filterArr = filterString.split('||')

      //
      let arg: any

      if (filterArr[2]) {

        arg = filterArr[2].split(',')

        if (arg.length === 1) {
          arg = arg[0]
        }
      }

      //
      const subQEl = {
        'table': table,
        'field': filterArr[0],
        'operator': "$and",
        'condition': filterArr[1],
        'arg': arg
      }
      subQ.push(subQEl)

    }


    // filter obj
    else if (typeof (dto.filter) == 'object') {

      for (let dtoFilterKeys in dto.filter as object) {

        const filterString = dto.filter[dtoFilterKeys] as unknown as string
        const filterArr = filterString.split('||')

        //
        let arg: any

        if (filterArr[2]) {

          arg = filterArr[2].split(',')

          if (arg.length === 1) {
            arg = arg[0]
          }
        }

        //
        const subQEl = {
          'table': table,
          'field': filterArr[0],
          'operator': "$and",
          'condition': filterArr[1],
          'arg': arg
        }
        subQ.push(subQEl)

      }

    }


    // or string
    if (typeof (dto.or) == 'string') {

      const filterString = dto.or as unknown as string
      const filterArr = filterString.split('||')

      //
      let arg: any

      if (filterArr[2]) {

        arg = filterArr[2].split(',')

        if (arg.length === 1) {
          arg = arg[0]
        }
      }

      //
      const subQEl = {
        'table': table,
        'field': filterArr[0],
        'operator': "$or",
        'condition': filterArr[1],
        'arg': arg
      }
      subQ.push(subQEl)

    }


    // or obj
    else if (typeof (dto.or) == 'object') {

      for (let dtoFilterKeys in dto.or as object) {

        const filterString = dto.or[dtoFilterKeys] as unknown as string
        const filterArr = filterString.split('||')

        //
        let arg: any

        if (filterArr[2]) {

          arg = filterArr[2].split(',')

          if (arg.length === 1) {
            arg = arg[0]
          }
        }

        //
        const subQEl = {
          'table': table,
          'field': filterArr[0],
          'operator': "$or",
          'condition': filterArr[1],
          'arg': arg
        }
        subQ.push(subQEl)

      }

    }

    // console.log(subQ)
    queryFormer(query, subQ)


  }

  return query
}