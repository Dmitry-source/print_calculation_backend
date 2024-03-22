import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';



export function fieldsHandler (dto: any, alias: any, query: any) {

  if (dto.fields){
    try {

      if (typeof(dto.fields) == 'string'){
        const fieldsString = dto.fields as unknown as string
        const fieldsArr= fieldsString.split(',')

        query.select([])

        for (const fieldsArrKey in fieldsArr){
          query.addSelect([`${alias}.${fieldsArr[fieldsArrKey]}`])
        }
      }

      else if (typeof(dto.fields) == 'object'){
        query.select([])

        for (let dtoFieldsKey in dto.fields as object){
          const fieldsString = dto.fields[dtoFieldsKey] as unknown as string
          const fieldsArr= fieldsString.split(',')

          for (const key in fieldsArr){
            query.addSelect([`${alias}.${fieldsArr[key]}`])
          }
        }
      }

    }
    catch {
      throw new NotFoundException('Invalid fields params.')
    }
  }
  
    return query
  }