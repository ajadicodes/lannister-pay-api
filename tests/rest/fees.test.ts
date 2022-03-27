import {
  badlyFormattedFeeConfigSpec,
  correctSampleData,
} from '../helpers/data/fees';

import bodyParser from 'body-parser';
import connectionToDB from '../../src/utils/connectionToDB';
import express from 'express';
import {feeSpecModel} from '../../src/models/feeSpec.model';
import mongoose from 'mongoose';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import rest from '../../src/servers/rest';
import {serverConfig} from '../../src/servers/config';

beforeEach(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});
});

describe('/fees', () => {
  test('should return a request succeeded status', async () => {
    const app = express();
    app.use(bodyParser.json());
    rest(app, serverConfig);

    const response = await request(app)
      .post('/fees')
      .send(correctSampleData.payload);

    expect(response.status).toEqual(correctSampleData.expectedResponse.code);
    expect(response.body.message).toBe(
      correctSampleData.expectedResponse.message
    );
    expect(response.body.success).toBe(
      correctSampleData.expectedResponse.success
    );
  });

  test('should fail as fee spec contains invalid format', async () => {
    const app = express();
    app.use(bodyParser.json());
    rest(app, serverConfig);

    const response = await request(app)
      .post('/fees')
      .send(badlyFormattedFeeConfigSpec.payload);

    expect(response.status).toEqual(
      badlyFormattedFeeConfigSpec.expectedResponse.code
    );
    expect(response.body.message).toBeDefined();
    expect(response.body.success).toBe(
      badlyFormattedFeeConfigSpec.expectedResponse.success
    );
  });
});

afterAll(() => {
  mongoose.connection.close();
});
