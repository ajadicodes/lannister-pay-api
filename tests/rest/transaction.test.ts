import {sampleFeeSpec, sampleTransactions} from '../helpers/data/transaction';

import bodyParser from 'body-parser';
import connectionToDB from '../../src/utils/connectionToDB';
import express from 'express';
import {feeSpecModel} from '../../src/models/feeSpec.model';
import mongoose from 'mongoose';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import rest from '../../src/servers/rest';
import {serverConfig} from '../../src/servers/config';

beforeAll(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});

  // initialise database with valid test data for this set of tests in
  // assessment example
  await feeSpecModel.insertMany(sampleFeeSpec);
});

describe('/compute-transaction-fee', () => {
  test('example 1 should return correct transaction fee', async () => {
    const app = express();
    app.use(bodyParser.json());
    rest(app, serverConfig);

    const response = await request(app)
      .post('/compute-transaction-fee')
      .send(sampleTransactions[0].payload);

    expect(response.status).toBe(sampleTransactions[0].expectedResponse.code);
    expect(response.body.success).toBe(
      sampleTransactions[0].expectedResponse.success
    );
    expect(response.body.message).toBe(
      sampleTransactions[0].expectedResponse.message
    );
    expect(response.body.AppliedFeeID).toBe(
      sampleTransactions[0].expectedResponse.AppliedFeeID
    );
    expect(response.body.AppliedFeeValue).toBe(
      sampleTransactions[0].expectedResponse.AppliedFeeValue
    );
    expect(response.body.ChargeAmount).toBe(
      sampleTransactions[0].expectedResponse.ChargeAmount
    );
    expect(response.body.SettlementAmount).toBe(
      sampleTransactions[0].expectedResponse.SettlementAmount
    );
  });

  test('example 2 should return correct transaction fee', async () => {
    const app = express();
    app.use(bodyParser.json());
    rest(app, serverConfig);

    const response = await request(app)
      .post('/compute-transaction-fee')
      .send(sampleTransactions[1].payload);

    expect(response.status).toBe(sampleTransactions[1].expectedResponse.code);
    expect(response.body.success).toBe(
      sampleTransactions[1].expectedResponse.success
    );
    expect(response.body.message).toBe(
      sampleTransactions[1].expectedResponse.message
    );
    expect(response.body.AppliedFeeID).toBe(
      sampleTransactions[1].expectedResponse.AppliedFeeID
    );
    expect(response.body.AppliedFeeValue).toBe(
      sampleTransactions[1].expectedResponse.AppliedFeeValue
    );
    expect(response.body.ChargeAmount).toBe(
      sampleTransactions[1].expectedResponse.ChargeAmount
    );
    expect(response.body.SettlementAmount).toBe(
      sampleTransactions[1].expectedResponse.SettlementAmount
    );
    // expect(errors).toBeUndefined();
  });

  test('example 3 should return correct transaction fee', async () => {
    const app = express();
    app.use(bodyParser.json());
    rest(app, serverConfig);

    const response = await request(app)
      .post('/compute-transaction-fee')
      .send(sampleTransactions[2].payload);

    expect(response.status).toBe(sampleTransactions[2].expectedResponse.code);
    expect(response.body.success).toBe(
      sampleTransactions[2].expectedResponse.success
    );
    expect(response.body.message).toBe(
      sampleTransactions[2].expectedResponse.message
    );
    expect(response.body.AppliedFeeID).toBe(
      sampleTransactions[2].expectedResponse.AppliedFeeID
    );
    expect(response.body.AppliedFeeValue).toBe(
      sampleTransactions[2].expectedResponse.AppliedFeeValue
    );
    expect(response.body.ChargeAmount).toBe(
      sampleTransactions[2].expectedResponse.ChargeAmount
    );
    expect(response.body.SettlementAmount).toBe(
      sampleTransactions[2].expectedResponse.SettlementAmount
    );
    // expect(errors).toBeUndefined();
  });
});

afterAll(() => {
  mongoose.connection.close();
});
