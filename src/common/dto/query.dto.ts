// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

import {
  IsBoolean, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsNumber, MinLength,
  Min, Max
} from 'class-validator';





export class QueryBulkDto {

  @IsOptional()
  @ApiProperty({ description: 'Quering fields: "username,email"', required: false })
  fields: Array<string>

  @IsOptional()
  @ApiProperty({ 
    description: 'Search by field. Examples: {"username": "Sunrise55g"} , {"updatedAt":{"$between":["2024-02-14T12:00", "2024-02-14T12:59"]}}. Conditions: $eq, $ne, $gt, $lt, $gte, $lte, $starts, $ends, $cont, $excl, $in, $notin, $between, $isnull, $notnull, $eqL, $neL, $startsL, $endsL, $contL, $exclL, $inL, $notinL', 
    required: false 
  })
  s: string

  @IsOptional()
  @ApiProperty({ 
    description: 'Add conditions to request: "id||$in||1". Conditions: $eq, $ne, $gt, $lt, $gte, $lte, $starts, $ends, $cont, $excl, $in, $notin, $between, $isnull, $notnull, $eqL, $neL, $startsL, $endsL, $contL, $exclL, $inL, $notinL',
    required: false 
  })
  filter: Array<string>

  @IsOptional()
  @ApiProperty({ 
    description: 'Add conditions to request as OR-operator: "id||$eq||2". Conditions: $eq, $ne, $gt, $lt, $gte, $lte, $starts, $ends, $cont, $excl, $in, $notin, $between, $isnull, $notnull, $eqL, $neL, $startsL, $endsL, $contL, $exclL, $inL, $notinL',
    required: false 
  })
  or: Array<string>

  @IsOptional()
  @ApiProperty({ description: 'Sorting option: "id,ASC"', required: false })
  sort: Array<string>

  @IsOptional()
  @ApiProperty({ description: 'Join related: "?join=relation1&join=relation1||field1,field2&join=relation1.nested&join=relation1.nested.deepnested"', required: false })
  join: Array<string>

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @Max(1200)
  @IsOptional()
  @ApiProperty({ example: 10, type: 'Integer', description: 'Count on page', required: false })
  limit: number = 10

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ example: 0, type: 'Integer', description: 'Offset count', required: false })
  offset: number = 0;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0)
  @IsOptional()
  @ApiProperty({ example: 1, type: 'Integer', description: 'Page number', required: false })
  page: number = 1;

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Show deleted relations.', required: false })
  deletedRelations: boolean = false;

  // @Transform(({ value }) => parseInt(value))
  // @IsOptional()
  // @IsNumber()
  // @ApiProperty({ example: 0, type: 'Integer', description: 'Reset cache', required: false })
  // cache: number
}


export class QueryDto {

  @IsOptional()
  @ApiProperty({ description: 'Quering fields: "username,email"', required: false })
  fields: Array<string>

  @IsOptional()
  @ApiProperty({ description: 'Join related: "?join=relation1&join=relation1||field1,field2&join=relation1.nested&join=relation1.nested.deepnested"', required: false })
  join: Array<string>

  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  @IsBoolean()
  @ApiProperty({ description: 'Show deleted relations.', required: false })
  deletedRelations: boolean = false;

  // @Transform(({ value }) => parseInt(value))
  // @IsOptional()
  // @IsNumber()
  // @ApiProperty({ example: 0, type: 'Integer', description: 'Reset cache', required: false })
  // cache: number
}
