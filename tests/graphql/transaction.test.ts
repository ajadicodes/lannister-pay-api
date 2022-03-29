import {COMPUTE_TRANSACTION_FEE, testServer} from '../helpers/utils';
import {sampleFeeSpec, sampleTransactions} from '../helpers/data/transaction';

import connectionToDB from '../../src/utils/connectionToDB';
import {feeSpecModel} from '../../src/models/feeSpec.model';
import mongoose from 'mongoose';

beforeAll(async () => {
  await connectionToDB();
  await feeSpecModel.deleteMany({});

  // initialise database with valid test data for this set of tests in
  // assessment example
  await feeSpecModel.insertMany(sampleFeeSpec);
});

describe('ComputeTransactionFee', () => {
  test('example 1 should return correct transaction fee', async () => {
    const {data, errors} = await testServer().executeOperation({
      query: COMPUTE_TRANSACTION_FEE,
      variables: {...sampleTransactions[0].payload},
    });

    expect(data?.computeTransactionFee?.code).toBe(
      sampleTransactions[0].expectedResponse.code
    );
    expect(data?.computeTransactionFee?.success).toBe(
      sampleTransactions[0].expectedResponse.success
    );
    expect(data?.computeTransactionFee?.message).toBe(
      sampleTransactions[0].expectedResponse.message
    );
    expect(data?.computeTransactionFee?.AppliedFeeID).toBe(
      sampleTransactions[0].expectedResponse.AppliedFeeID
    );
    expect(data?.computeTransactionFee?.AppliedFeeValue).toBe(
      sampleTransactions[0].expectedResponse.AppliedFeeValue
    );
    expect(data?.computeTransactionFee?.ChargeAmount).toBe(
      sampleTransactions[0].expectedResponse.ChargeAmount
    );
    expect(data?.computeTransactionFee?.SettlementAmount).toBe(
      sampleTransactions[0].expectedResponse.SettlementAmount
    );
    expect(errors).toBeUndefined();
  });

  test('example 2 should return correct transaction fee', async () => {
    const {data, errors} = await testServer().executeOperation({
      query: COMPUTE_TRANSACTION_FEE,
      variables: {...sampleTransactions[1].payload},
    });

    expect(data?.computeTransactionFee?.code).toBe(
      sampleTransactions[1].expectedResponse.code
    );
    expect(data?.computeTransactionFee?.success).toBe(
      sampleTransactions[1].expectedResponse.success
    );
    expect(data?.computeTransactionFee?.message).toBe(
      sampleTransactions[1].expectedResponse.message
    );
    expect(data?.computeTransactionFee?.AppliedFeeID).toBe(
      sampleTransactions[1].expectedResponse.AppliedFeeID
    );
    expect(data?.computeTransactionFee?.AppliedFeeValue).toBe(
      sampleTransactions[1].expectedResponse.AppliedFeeValue
    );
    expect(data?.computeTransactionFee?.ChargeAmount).toBe(
      sampleTransactions[1].expectedResponse.ChargeAmount
    );
    expect(data?.computeTransactionFee?.SettlementAmount).toBe(
      sampleTransactions[1].expectedResponse.SettlementAmount
    );
    expect(errors).toBeUndefined();
  });

  test('example 3 should return correct transaction fee', async () => {
    const {data, errors} = await testServer().executeOperation({
      query: COMPUTE_TRANSACTION_FEE,
      variables: {...sampleTransactions[2].payload},
    });

    expect(data).toBeFalsy();
    expect(errors).toBeDefined();
    //   expect(errors[0]?.message).toBe(
    //     sampleTransactions[2].expectedResponse.message
    //   );
    //   expect(errors[0]?.extensions?.code).toBe('BAD_USER_INPUT');
  });
});

afterAll(() => {
  mongoose.connection.close();
});
