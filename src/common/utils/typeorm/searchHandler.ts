import { Injectable, BadRequestException, NotFoundException, ConsoleLogger } from '@nestjs/common';
import { EOperator, IOperator, ECondition, ICondition } from './types';
import { queryFormer } from './queryFormer';



export function searchHandler(dto: any, table: any, query: any) {

  if (dto.s) {
    // console.log('Start searchHandler')

    if (typeof (dto.s) == 'string') {

      //
      let searchObj = {}
      try {
        searchObj = JSON.parse(dto.s)
      }
      catch {
        throw new BadRequestException(`GET parameters parsing error`)
      }

      // console.log(searchObj)

      //
      let field: string
      let operator: any = '$and'
      let condition: any = '$eq'
      let arg: any
      let subQ = []


      function recurs(obj: any) {

        for (const key in obj) {
          let value = obj[key]


          // for key is field
          if (typeof (key) === 'string' && !(key in EOperator) && !(key in ECondition)) {
            field = key

            if (typeof (value) == 'object') {
              // console.log(value)
              recurs(value)
            }
            else if (!(value in EOperator) && !(value in ECondition)) {
              const subQEl = {
                'table': table,
                'field': field,
                'operator': operator,
                'condition': condition,
                'arg': value
              }
              subQ.push(subQEl)
            }

          }


          // for key is operator
          if ((key in EOperator) && !(key in ECondition)) {
            operator = key

            if (typeof (value) == 'object') {
              // console.log(value)
              recurs(value)
            }

          }


          // for key in condition
          if (!(key in EOperator) && (key in ECondition)) {
            condition = key

            if (!(value in EOperator) && !(value in ECondition)) {
              const subQEl = {
                'table': table,
                'field': field,
                'operator': operator,
                'condition': condition,
                'arg': value
              }
              subQ.push(subQEl)
            }
          }

        }

      }

      recurs(searchObj)

      // console.log(subQ)
      queryFormer(query, subQ)

    }

  }


  return query
}