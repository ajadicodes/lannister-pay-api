import {IntStringScalar} from '../../utils';
import {Resolvers} from '../../types/resolvers-types';
import {addFeeConfigurationSpec} from './mutation';
import {computeTransactionFee} from './query';

export const resolvers: Resolvers = {
  Mutation: {
    // add fees configuration specification
    fees: addFeeConfigurationSpec,
  },
  Query: {
    computeTransactionFee,
  },
  IntString: IntStringScalar,
};
