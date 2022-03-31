import {ADD_FEE_CONFIGURATION_SPEC, testServer} from './helpers/utils';
import {
  badlyFormattedFeeConfigSpec,
  feeSpecification,
} from './helpers/data/fees';

import bodyParser from 'body-parser';
import connectionToDB from '../src/utils/connectionToDB';
import express from 'express';
import {feeSpecModel} from '../src/models/feeSpec.model';
import mongoose from 'mongoose';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';
import rest from '../src/servers/rest';
import {sampleFeeSpec} from './helpers/data/transactions';
import {serverConfig} from '../src/servers/config';
import {sum} from 'lodash';

beforeEach(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});
});

describe('fees', () => {
  describe('Rest API', () => {
    it('should return a request succeeded status', async () => {
      const app = express();
      app.use(bodyParser.json());
      rest(app, serverConfig);

      const response = await request(app)
        .post('/fees')
        .send(feeSpecification.payload);

      expect(response.status).toEqual(feeSpecification.expectedResponse.code);
      expect(response.body.message).toBe(
        feeSpecification.expectedResponse.message
      );
      expect(response.body.success).toBe(
        feeSpecification.expectedResponse.success
      );

      // test specificity weight
      const feeSpecDoc = await feeSpecModel.find(
        {},
        {_id: 0, specificityCount: 1}
      );
      const totalSpecificityWeight = sum(
        feeSpecDoc.map(doc => doc.specificityCount)
      );
      expect(totalSpecificityWeight).toBe(
        sum(sampleFeeSpec.map(spec => spec.specificityCount))
      );
    });

    it('should fail as fee spec contains invalid format', async () => {
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

  describe('GraphQL', () => {
    it('fails because fee specification is badly formatted', async () => {
      const feeConfigSpec =
        badlyFormattedFeeConfigSpec.payload.FeeConfigurationSpec;
      const {data, errors} = await testServer().executeOperation({
        query: ADD_FEE_CONFIGURATION_SPEC,
        variables: {FeeConfigurationSpec: feeConfigSpec},
      });

      expect(data).toBeFalsy();
      expect(errors).toBeDefined();
      // expect(errors[0]?.extensions?.code).toBe('BAD_USER_INPUT');
      // expect(errors[0]?.message).toBeDefined();
    });

    test('successfully registers fee specification', async () => {
      const feeConfigSpec = feeSpecification.payload.FeeConfigurationSpec;
      const {data, errors} = await testServer().executeOperation({
        query: ADD_FEE_CONFIGURATION_SPEC,
        variables: {FeeConfigurationSpec: feeConfigSpec},
      });

      expect(data?.fees?.code).toBe(feeSpecification.expectedResponse.code);
      expect(data?.fees?.success).toBe(
        feeSpecification.expectedResponse.success
      );
      expect(errors).toBeUndefined();

      // test specificity weight
      const feeSpecDoc = await feeSpecModel.find(
        {},
        {_id: 0, specificityCount: 1}
      );
      const totalSpecificityWeight = sum(
        feeSpecDoc.map(doc => doc.specificityCount)
      );
      expect(totalSpecificityWeight).toBe(
        sum(sampleFeeSpec.map(spec => spec.specificityCount))
      );
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
