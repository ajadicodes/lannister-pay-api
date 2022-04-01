import {ADD_FEE_CONFIGURATION_SPEC, testServer} from './helpers/utils';
import {
  badlyFormattedFeeConfigSpec,
  feeSpecification,
} from './helpers/data/fees';

import {AddFeeMutationResponse} from '../src/types/resolvers-types';
import connectionToDB from '../src/utils/connectionToDB';
// eslint-disable-next-line node/no-unpublished-import
import {createMercuriusTestClient} from 'mercurius-integration-testing';
import {feeSpecModel} from '../src/models/feeSpec.model';
import mongoose from 'mongoose';
import {sampleFeeSpec} from './helpers/data/transactions';
import {sum} from 'lodash';

beforeEach(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});
});

describe('fees', () => {
  describe('Rest API', () => {
    it('should return a request succeeded status', async () => {
      const app = testServer('rest');
      const response = await app.inject({
        method: 'POST',
        url: '/fees',
        payload: feeSpecification.payload,
      });

      const body = JSON.parse(response.body) as AddFeeMutationResponse;

      expect(body.code).toEqual(feeSpecification.expectedResponse.code);
      expect(body.message).toBe(feeSpecification.expectedResponse.message);
      expect(body.success).toBe(feeSpecification.expectedResponse.success);

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
      const app = testServer('rest');
      const response = await app.inject({
        method: 'POST',
        url: '/fees',
        payload: badlyFormattedFeeConfigSpec.payload,
      });

      const body = JSON.parse(response.body) as AddFeeMutationResponse;

      expect(body.code).toEqual(
        badlyFormattedFeeConfigSpec.expectedResponse.code
      );
      expect(body.message).toBeDefined();
      expect(body.success).toBe(
        badlyFormattedFeeConfigSpec.expectedResponse.success
      );
    });
  });

  describe('GraphQL', () => {
    it('fails because fee specification is badly formatted', async () => {
      const feeConfigSpec =
        badlyFormattedFeeConfigSpec.payload.FeeConfigurationSpec;
      const client = createMercuriusTestClient(testServer('graphql'));
      const {data, errors} = await client.mutate(ADD_FEE_CONFIGURATION_SPEC, {
        variables: {
          FeeConfigurationSpec: feeConfigSpec,
        },
      });

      expect(data).toBeFalsy();
      expect(errors).toBeDefined();
      // expect(errors[0]?.extensions?.code).toBe('BAD_USER_INPUT');
      // expect(errors[0]?.message).toBeDefined();
    });

    test('successfully registers fee specification', async () => {
      const feeConfigSpec = feeSpecification.payload.FeeConfigurationSpec;

      const client = createMercuriusTestClient(testServer('graphql'));
      const {data, errors} = await client.mutate(ADD_FEE_CONFIGURATION_SPEC, {
        variables: {
          FeeConfigurationSpec: feeConfigSpec,
        },
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
