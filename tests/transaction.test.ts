import {COMPUTE_TRANSACTION_FEE, testServer} from './helpers/utils';
import {sampleFeeSpec, sampleTransactions} from './helpers/data/transactions';

import {ComputeTransactionFeeResponse} from '../src/types/resolvers-types';
import connectionToDB from '../src/utils/connectionToDB';
import fastify from 'fastify';
import {feeSpecModel} from '../src/models/feeSpec.model';
import mongoose from 'mongoose';
// eslint-disable-next-line node/no-unpublished-import
import rest from '../src/servers/rest';
import {serverConfig} from '../src/servers/config';

beforeAll(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});

  // initialise database with valid test data for this set of tests in
  // assessment example
  await feeSpecModel.insertMany(sampleFeeSpec);
});

describe('compute-transaction-fee', () => {
  describe('REST API', () => {
    it.each(sampleTransactions)(
      'applies correct configuration fee for transaction with $payload.ID',
      async ({payload, expectedResponse}) => {
        const app = fastify();
        rest(app, serverConfig);
        const response = await app.inject({
          method: 'POST',
          url: '/compute-transaction-fee',
          payload,
        });

        const body = JSON.parse(response.body) as ComputeTransactionFeeResponse;

        expect(body.code).toBe(expectedResponse.code);
        expect(body.success).toBe(expectedResponse.success);
        expect(body.message).toBe(expectedResponse.message);
        expect(body.AppliedFeeID).toBe(expectedResponse.AppliedFeeID);
        expect(body.AppliedFeeValue).toBe(expectedResponse.AppliedFeeValue);
        expect(body.ChargeAmount).toBe(expectedResponse.ChargeAmount);
        expect(body.SettlementAmount).toBe(expectedResponse.SettlementAmount);
      }
    );
  });

  describe('GraphQL', () => {
    it.each(sampleTransactions)(
      'applies correct configuration fee for transaction with $payload.ID',
      async ({payload, expectedResponse}) => {
        const {data, errors} = await testServer().executeOperation({
          query: COMPUTE_TRANSACTION_FEE,
          variables: {...payload},
        });

        expect(data?.computeTransactionFee?.code).toBe(expectedResponse.code);
        expect(data?.computeTransactionFee?.success).toBe(
          expectedResponse.success
        );
        expect(data?.computeTransactionFee?.message).toBe(
          expectedResponse.message
        );
        expect(data?.computeTransactionFee?.AppliedFeeID).toBe(
          expectedResponse.AppliedFeeID
        );
        expect(data?.computeTransactionFee?.AppliedFeeValue).toBe(
          expectedResponse.AppliedFeeValue
        );
        expect(data?.computeTransactionFee?.ChargeAmount).toBe(
          expectedResponse.ChargeAmount
        );
        expect(data?.computeTransactionFee?.SettlementAmount).toBe(
          expectedResponse.SettlementAmount
        );
        expect(errors).toBeUndefined();
      }
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
