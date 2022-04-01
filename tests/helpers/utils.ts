import {graphql, rest} from '../../src/servers';

import fastify from 'fastify';
import {gql} from 'apollo-server-core';
import {serverConfig} from '../../src/servers/config';

export const ADD_FEE_CONFIGURATION_SPEC = gql`
  mutation AddFeeConfigurationSpec($FeeConfigurationSpec: String!) {
    fees(FeeConfigurationSpec: $FeeConfigurationSpec) {
      code
      success
    }
  }
`;

export const createFeeConfigurationSpecQuery = (spec: unknown) => {
  return `mutation {fees(FeeConfigurationSpec: "${spec}") { code success }}`;
};

export const computeTransactionFeeQuery = ({
  id,
  amount,
  currency,
  currencyCountry,
  customer,
  paymentEntity,
}: {
  id: unknown;
  amount: unknown;
  currency: unknown;
  currencyCountry: unknown;
  customer: unknown;
  paymentEntity: unknown;
}) => {
  return `query {computeTransactionFee(
    ID: ${id}
    Amount: ${amount}
    Currency: ${currency}
    CurrencyCountry: ${currencyCountry}
    Customer: ${customer}
    PaymentEntity: ${paymentEntity}
  ) {
    code
    success
    message
    AppliedFeeID
    AppliedFeeValue
    ChargeAmount
    SettlementAmount
  }}`;
};

export const COMPUTE_TRANSACTION_FEE = gql`
  query ComputeTransactionFee(
    $ID: Int!
    $Amount: Int!
    $Currency: String!
    $CurrencyCountry: String!
    $Customer: CustomerType!
    $PaymentEntity: PaymentEntityType!
  ) {
    computeTransactionFee(
      ID: $ID
      Amount: $Amount
      Currency: $Currency
      CurrencyCountry: $CurrencyCountry
      Customer: $Customer
      PaymentEntity: $PaymentEntity
    ) {
      code
      success
      message
      AppliedFeeID
      AppliedFeeValue
      ChargeAmount
      SettlementAmount
    }
  }
`;

export const testServer = (server: 'rest' | 'graphql' = 'rest') => {
  const app = fastify();

  if (server === 'rest') {
    rest(app, serverConfig);
    return app;
  }

  graphql(app, serverConfig);
  return app;
};
