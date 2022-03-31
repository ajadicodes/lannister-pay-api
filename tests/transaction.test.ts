import {COMPUTE_TRANSACTION_FEE, testServer} from './helpers/utils';
import {sampleFeeSpec, sampleTransactions} from './helpers/data/transactions';

import bodyParser from 'body-parser';
import connectionToDB from '../src/utils/connectionToDB';
import express from 'express';
import {feeSpecModel} from '../src/models/feeSpec.model';
import mongoose from 'mongoose';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
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
        const app = express();
        app.use(bodyParser.json());
        rest(app, serverConfig);

        const response = await request(app)
          .post('/compute-transaction-fee')
          .send(payload);

        expect(response.status).toBe(expectedResponse.code);
        expect(response.body.success).toBe(expectedResponse.success);
        expect(response.body.message).toBe(expectedResponse.message);
        expect(response.body.AppliedFeeID).toBe(expectedResponse.AppliedFeeID);
        expect(response.body.AppliedFeeValue).toBe(
          expectedResponse.AppliedFeeValue
        );
        expect(response.body.ChargeAmount).toBe(expectedResponse.ChargeAmount);
        expect(response.body.SettlementAmount).toBe(
          expectedResponse.SettlementAmount
        );
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
