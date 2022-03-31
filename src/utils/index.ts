import {
  CustomerType,
  QueryComputeTransactionFeeArgs,
} from '../types/resolvers-types';
import {Entity, FeeSpec, FeeType, FeeValue} from '../types';
import {GraphQLScalarType, Kind} from 'graphql';

import {UserInputError} from 'apollo-server-errors';
import {reduce} from 'lodash';
import validator from 'validator';

/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const parseFeeIDSpec = (value: unknown) => {
  if (!value) throw new UserInputError('Missing fee ID specification');

  if (
    typeof value !== 'string' ||
    value.length !== 8 ||
    !validator.isAlphanumeric(value)
  )
    throw new UserInputError('Invalid fee configuration identifier');

  return value;
};

const parseFeeCurrencySpec = (value: unknown) => {
  if (!value) throw new UserInputError('Missing fee currency specification');

  if (typeof value !== 'string' || !validator.isIn(value, ['NGN', '*']))
    throw new UserInputError('Invalid fee configuration currency');

  return value;
};

const parseFeeLocaleSpec = (value: unknown) => {
  if (!value) throw new UserInputError('Missing fee locale specification');

  if (
    typeof value !== 'string' ||
    !validator.isIn(value, ['LOCL', 'INTL', '*'])
  )
    throw new UserInputError('Invalid fee locale');

  return value;
};

const parseFeeEntitySpec = (value: unknown) => {
  if (!value) throw new UserInputError('Missing fee entity specification');

  if (
    typeof value !== 'string' ||
    !validator.isIn(value, [
      'CREDIT-CARD',
      'DEBIT-CARD',
      'BANK-ACCOUNT',
      'USSD',
      'WALLET-ID',
      '*',
    ])
  )
    throw new UserInputError('Invalid fee entity');

  return value;
};

const parseEntityPropertySpec = (value: unknown) => {
  // TODO: what else do I need to validate here?
  if (typeof value !== 'string')
    throw new UserInputError('Invalid entity property');
  return value;
};

// *(*)
const parseEntitySpec = (value: unknown): Entity => {
  // TODO: a more elegant way of getting the values in this format -- *(*)?
  if (!value) throw new UserInputError('Missing Entity Specification');

  if (typeof value !== 'string')
    throw new UserInputError('Invalid entity specification');

  const values = value.split('(');
  const feeEntity = values[0];

  // remove trailing ')'
  const entityProperty = values[1].substring(0, values[1].length - 1);

  return {
    feeEntity: parseFeeEntitySpec(feeEntity),
    entityProperty: parseEntityPropertySpec(entityProperty),
  };
};

const parseFeeTypeSpec = (value: unknown) => {
  if (!value) throw new UserInputError('Missing fee type specification');

  if (
    typeof value !== 'string' ||
    !validator.isIn(value, ['FLAT', 'PERC', 'FLAT_PERC'])
  )
    throw new UserInputError('Invalid fee type specification');

  return value;
};

const isNumericAndNonNegative = (value: unknown) => {
  // 0 inclusive
  return (
    typeof value === 'string' &&
    validator.isNumeric(value) &&
    Number(value) >= 0
  );
};

const parseFeeValueSpec = (value: unknown, type: FeeType): FeeValue => {
  if (!value) throw new UserInputError('Missing fee value specification');

  if (typeof value !== 'string')
    throw new UserInputError('Invalid fee value specification');

  // is it a flat and percentage value?
  switch (type) {
    case 'FLAT':
      return {
        type: 'FLAT',
        flatValue: value,
      };

    case 'PERC':
      return {
        type: 'PERC',
        percValue: value,
      };

    case 'FLAT_PERC': {
      if (!value.includes(':'))
        throw new UserInputError('Bad flat and percentage value formats');

      const flatAndPercValues = value.split(':');
      if (flatAndPercValues.length !== 2)
        throw new UserInputError('Invalid Flat and Percentage values');

      const [flatValue, percValue] = flatAndPercValues;
      // ensure it is numeric and a non negative value
      if (
        !isNumericAndNonNegative(flatValue) ||
        !isNumericAndNonNegative(percValue)
      )
        throw new UserInputError('Invalid Flat / Percentage values');

      return {
        type: 'FLAT_PERC',
        flatValue,
        percValue,
      };
    }
  }
};

export const parseFeeSpec = (value: unknown): FeeSpec => {
  if (!value) throw new UserInputError('Missing parse fee specification');

  if (typeof value !== 'string')
    throw new UserInputError('Invalid fee specification');
  const values = value.split(' ');

  // {FEE-ID} {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY}({ENTITY-PROPERTY}) : APPLY {FEE-TYPE} {FEE-VALUE}
  const feeID = values[0];
  const feeCurrency = values[1];
  const feeLocale = values[2];
  const entity = values[3];
  const feeType = values[6];
  const feeValue = values[7];

  // using type assertion here because I am sure it will only return something
  // of type FeeType
  const parsedFeeType = parseFeeTypeSpec(feeType) as FeeType;
  const feeSpec = {
    feeID: parseFeeIDSpec(feeID),
    feeCurrency: parseFeeCurrencySpec(feeCurrency),
    feeLocale: parseFeeLocaleSpec(feeLocale),
    entity: parseEntitySpec(entity),
    // feeType: parsedFeeType,
    feeValue: parseFeeValueSpec(feeValue, parsedFeeType),
  };

  // weight based specificity
  const specificityCount = computeSpecificityCount([
    feeSpec.entity.feeEntity === '*' ? 0 : 8,
    feeSpec.entity.entityProperty === '*' ? 0 : 4,
    feeSpec.feeLocale === '*' ? 0 : 2,
    feeSpec.feeCurrency === '*' ? 0 : 1, // may not be necessary if we only allow "NGN" specification
  ]);

  return {...feeSpec, specificityCount};
};

export const computeAppliedFeeValue = (
  feeValue: FeeValue,
  transactionAmount: QueryComputeTransactionFeeArgs['Amount']
) => {
  switch (feeValue.type) {
    case 'FLAT':
      return feeValue.flatValue;
    case 'PERC':
      // ((fee value * transaction amount ) / 100)
      return (
        (Number(feeValue.percValue) * transactionAmount) /
        100
      ).toString();

    case 'FLAT_PERC':
      // flat fee value + ((perc value * transaction amount ) / 100)
      return (
        Number(feeValue.flatValue) +
        (Number(feeValue.percValue) * transactionAmount) / 100
      ).toString();
    default:
      return assertNever;
  }
};

export const computeChargeAmount = (
  isCustomerBearsFee: CustomerType['BearsFee'],
  transactionAmount: QueryComputeTransactionFeeArgs['Amount'],
  appliedValue: ReturnType<typeof computeAppliedFeeValue>
) => {
  if (!isCustomerBearsFee) return transactionAmount;

  // Transaction Amount + AppliedFeeValue
  return transactionAmount + Number(appliedValue);
};

const MAX_INT = 2147483647;
const MIN_INT = -2147483648;
const coerceIntString = (value: unknown) => {
  if (Array.isArray(value)) {
    throw new TypeError(
      `IntString cannot represent an array value: [${String(value)}]`
    );
  }
  if (typeof value === 'number' && Number.isInteger(value)) {
    if (value < MIN_INT || value > MAX_INT) {
      throw new TypeError(
        `Value is integer but outside of valid range for 32-bit signed integer: ${String(
          value
        )}`
      );
    }
    return value;
  }
  return String(value);
};

// SixID example test data contains both string and number types
// Example 1 & 2 are of type number
// Example 3 are of type string
// A Scalar type to coerce Int into String since we cannot have
// a field to be of type String | Int in GraphQL
export const IntStringScalar = new GraphQLScalarType({
  name: 'IntString',
  serialize: coerceIntString,
  parseValue: coerceIntString,
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return coerceIntString(parseInt(ast.value, 10));
    }
    if (ast.kind === Kind.STRING) {
      return ast.value;
    }
    return undefined;
  },
});

// specificity count to cater for entity property with this format: 530191******290
// which will give a false specifically count if we are simply counting by *s.
// a valid specificity count is a string with exactly one "*"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const computeSpecificityCount = (collection: any[]) => {
  return reduce(collection, (sum, n) => sum + n, 0);
};
