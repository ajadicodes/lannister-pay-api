import {apolloGraphqlServer} from '../../src/servers/graphql';
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

export const testServer = () => {
  return apolloGraphqlServer(fastify(), serverConfig);
};
