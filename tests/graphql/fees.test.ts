import {ADD_FEE_CONFIGURATION_SPEC, testServer} from '../helpers/utils';
import {
  badlyFormattedFeeConfigSpec,
  correctSampleData,
} from '../helpers/data/fees';

import connectionToDB from '../../src/utils/connectionToDB';
import {feeSpecModel} from '../../src/models/feeSpec.model';
import mongoose from 'mongoose';

beforeEach(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});
});

describe('Fees Mutation', () => {
  describe('Fee Specification Configuration', () => {
    test('should fail: Badly Formatted', async () => {
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

    test('should be successful', async () => {
      const feeConfigSpec = correctSampleData.payload.FeeConfigurationSpec;
      const {data, errors} = await testServer().executeOperation({
        query: ADD_FEE_CONFIGURATION_SPEC,
        variables: {FeeConfigurationSpec: feeConfigSpec},
      });

      expect(data?.fees?.code).toBe(correctSampleData.expectedResponse.code);
      expect(data?.fees?.success).toBe(
        correctSampleData.expectedResponse.success
      );
      expect(errors).toBeUndefined();
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
