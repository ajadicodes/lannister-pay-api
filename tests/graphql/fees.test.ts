import {
  ADD_FEE_CONFIGURATION_SPEC,
  createFeeConfigurationSpecQuery,
  testServer,
} from '../helpers/utils';
import {
  badlyFormattedFeeConfigSpec,
  correctSampleData,
} from '../helpers/data/fees';

import connectionToDB from '../../src/utils/connectionToDB';
import {feeSpecModel} from '../../src/models/feeSpec.model';
import mongoose from 'mongoose';
import {query} from 'express';
// eslint-disable-next-line node/no-unpublished-import
import request from 'supertest';

beforeEach(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});
});

describe('Fees Mutation', () => {
  const app = testServer('graphql');
  describe('Fee Specification Configuration', () => {
    test('should fail: Badly Formatted', async () => {
      const feeConfigSpec =
        badlyFormattedFeeConfigSpec.payload.FeeConfigurationSpec;

      const response = await request(app)
        .post('/graphql')
        .send(
          JSON.stringify({
            query: createFeeConfigurationSpecQuery(feeConfigSpec),
          })
        )
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');

      console.log(
        '\n\n\n\n\n\n\n\n\n\nRESPONSE:',
        response.body,
        '\n\n\n\n\n\n\n\n\n\n'
      );

      expect(response.body).toBeFalsy();
      expect(response.status).toBe(400);
      // expect(errors[0]?.extensions?.code).toBe('BAD_USER_INPUT');
      // expect(errors[0]?.message).toBeDefined();
    });

    // test('should be successful', async () => {
    //   const feeConfigSpec = correctSampleData.payload.FeeConfigurationSpec;
    //   const {data, errors} = await testServer().executeOperation({
    //     query: ADD_FEE_CONFIGURATION_SPEC,
    //     variables: {FeeConfigurationSpec: feeConfigSpec},
    //   });

    //   expect(data?.fees?.code).toBe(correctSampleData.expectedResponse.code);
    //   expect(data?.fees?.success).toBe(
    //     correctSampleData.expectedResponse.success
    //   );
    //   expect(errors).toBeUndefined();
    // });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
