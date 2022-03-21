import {IntStringScalar} from './utils';
import {Resolvers} from './resolvers-types';
import {addFeeConfigurationSpec} from './resolvers/mutation';
import {computeTransactionFee} from './resolvers/query';

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
