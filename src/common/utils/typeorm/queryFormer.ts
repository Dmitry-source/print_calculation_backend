import { Injectable, BadRequestException, NotFoundException, ConsoleLogger } from '@nestjs/common';
import { EOperator, IOperator, ECondition, ICondition } from './types';



export function queryFormer(query: any, subQ: any) {

  let queryStr: string = ''
  let queryArg = {}
  let beginQuery = true


  for (const key in subQ) {
    const el = subQ[key]

    //
    if (['$eq', '$ne', '$gt', '$lt', '$gte', '$lte'].includes(el.condition)) {

      if (
        typeof (el.arg) !== 'object'
        && typeof (el.arg) !== 'function'
        && typeof (el.arg) !== 'undefined'
      ) {
        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        //
        queryStr += `${el.table}.${el.field} `
        queryStr += `${ECondition[el.condition]} `
        queryStr += `:arg${key}_${el.field} `

        //
        queryArg[`arg${key}_${el.field}`] = el.arg

      }
      else {
        throw new BadRequestException(`Invalid ${el.condition} argument.`)
      }
    }


    //
    if (['$starts', '$ends', '$cont', '$excl'].includes(el.condition)) {

      if (
        typeof (el.arg) !== 'object'
        && typeof (el.arg) !== 'function'
        && typeof (el.arg) !== 'undefined'
      ) {

        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        //
        queryStr += `${el.table}.${el.field} `
        queryStr += `${ECondition[el.condition]} `
        queryStr += `:arg${key}_${el.field} `

        //
        if (el.condition === '$starts') { queryArg[`arg${key}_${el.field}`] = `${el.arg}%` }
        if (el.condition === '$ends') { queryArg[`arg${key}_${el.field}`] = `%${el.arg}` }
        if (el.condition === '$cont') { queryArg[`arg${key}_${el.field}`] = `%${el.arg}%` }
        if (el.condition === '$excl') { queryArg[`arg${key}_${el.field}`] = `%${el.arg}%` }

      }
      else {
        throw new BadRequestException(`Invalid ${el.condition} argument.`)
      }
    }


    //
    if (['$in', '$notin'].includes(el.condition)) {

      if (typeof (el.arg) !== 'object') {
        el.arg = [el.arg]
      }

      try{
        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        //
        queryStr += `${el.table}.${el.field} `
        queryStr += `${ECondition[el.condition]} `
        queryStr += `(:...arg${key}_${el.field}) `

        //
        queryArg[`arg${key}_${el.field}`] = el.arg

      }
      catch {
        throw new BadRequestException(`Invalid ${el.condition} argument.`)
      }
    }


    //
    if (['$isnull', '$notnull'].includes(el.condition)) {
      //
      if (beginQuery === false) {
        queryStr += `${EOperator[el.operator]} `
      }
      beginQuery = false

      //
      queryStr += `${el.table}.${el.field} `

      if (el.condition === '$isnull' && (el.arg === true || !el.arg)) { queryStr += `IS NULL ` }
      if (el.condition === '$isnull' && el.arg === false) { queryStr += `IS NOT NULL ` }
      if (el.condition === '$notnull' && (el.arg === true || !el.arg)) { queryStr += `IS NOT NULL ` }
      if (el.condition === '$notnull' && el.arg === false) { queryStr += `IS NULL ` }
    }


    //
    if (['$between'].includes(el.condition)) {

      if (typeof (el.arg) === 'object' && el.arg.length === 2) {
        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        const startArg = el.arg[0]
        const endArg = el.arg[1]

        //
        queryStr += `${el.table}.${el.field} `
        queryStr += `>= `
        queryStr += `:startArg${key}_${el.field} `
        queryStr += `AND `
        queryStr += `${el.table}.${el.field} `
        queryStr += `<= `
        queryStr += `:endArg${key}_${el.field} `

        //
        queryArg[`startArg${key}_${el.field}`] = startArg
        queryArg[`endArg${key}_${el.field}`] = endArg
      }
      else {
        throw new BadRequestException(`Invalid ${el.condition} arguments.`)
      }

    }


    //
    if (['$eqL', '$neL'].includes(el.condition)) {

      if (
        typeof (el.arg) !== 'object'
        && typeof (el.arg) !== 'function'
        && typeof (el.arg) !== 'undefined'
      ) {

        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        //
        queryStr += `LOWER(${el.table}.${el.field}) `
        queryStr += `${ECondition[el.condition]} `
        queryStr += `LOWER(:argL${key}_${el.field}) `

        //
        queryArg[`argL${key}_${el.field}`] = el.arg

      }
      else {
        throw new BadRequestException(`Invalid ${el.condition} argument.`)
      }
    }



    //
    if (['$startsL', '$endsL', '$contL', '$exclL'].includes(el.condition)) {

      if (
        typeof (el.arg) !== 'object'
        && typeof (el.arg) !== 'function'
        && typeof (el.arg) !== 'undefined'
      ) {

        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        //
        queryStr += `${el.table}.${el.field} `
        queryStr += `${ECondition[el.condition]} `
        queryStr += `:argL${key}_${el.field} `

        //
        if (el.condition === '$startsL') { queryArg[`argL${key}_${el.field}`] = `${el.arg}%` }
        if (el.condition === '$endsL') { queryArg[`argL${key}_${el.field}`] = `%${el.arg}` }
        if (el.condition === '$contL') { queryArg[`argL${key}_${el.field}`] = `%${el.arg}%` }
        if (el.condition === '$exclL') { queryArg[`argL${key}_${el.field}`] = `%${el.arg}%` }

      }
      else {
        throw new BadRequestException(`Invalid ${el.condition} argument.`)
      }
    }


    //
    if (['$inL', '$notinL'].includes(el.condition)) {

      if (typeof (el.arg) !== 'object') {
        el.arg = [el.arg]
      }

      try{
        //
        if (beginQuery === false) {
          queryStr += `${EOperator[el.operator]} `
        }
        beginQuery = false

        let argArr = el.arg
        for (const argArrKey in argArr) { argArr[argArrKey] = argArr[argArrKey].toLowerCase() }

        //
        queryStr += `LOWER(${el.table}.${el.field}) `
        queryStr += `${ECondition[el.condition]} `
        queryStr += `(:...argL${key}_${el.field}) `

        //
        queryArg[`argL${key}_${el.field}`] = el.arg

      }
      catch {
        throw new BadRequestException(`Invalid ${el.condition} arguments.`)
      }
    }

  }


  // console.log(queryStr)
  // console.log(queryArg)
  query.andWhere(queryStr, queryArg)

  return query
}