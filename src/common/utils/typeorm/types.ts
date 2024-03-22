



export enum EOperator {
  '$and' = 'AND',
  '$or' = 'OR'
}

export type IOperator =
  | '$and'
  | '$or'


export enum ECondition {
  '$eq' = '=',
  '$ne' = '!=',
  '$gt' = '>',
  '$lt' = '<',
  '$gte' = '>=',
  '$lte' = '<=',
  '$starts' = 'LIKE',
  '$ends' = 'LIKE',
  '$cont' = 'LIKE',
  '$excl' = 'NOT LIKE',
  '$in' = 'IN',
  '$notin' = 'NOT IN',
  '$between' = 'BETWEEN',
  '$isnull' = 'IS NULL',
  '$notnull' = 'IS NOT NULL',
  '$eqL' = '=',
  '$neL' = '!=',
  '$startsL' = 'ILIKE',
  '$endsL' = 'ILIKE',
  '$contL' = 'ILIKE',
  '$exclL' = 'NOT ILIKE',
  '$inL' = 'IN',
  '$notinL' = 'NOT IN'
}


export type ICondition =
  | '$eq'
  | '$ne'
  | '$gt'
  | '$lt'
  | '$gte'
  | '$lte'
  | '$starts'
  | '$ends'
  | '$cont'
  | '$excl'
  | '$in'
  | '$notin'
  | '$between'
  | '$isnull'
  | '$notnull'
  | '$eqL'
  | '$neL'
  | '$startsL'
  | '$endsL'
  | '$contL'
  | '$exclL'
  | '$inL'
  | '$notinL'
