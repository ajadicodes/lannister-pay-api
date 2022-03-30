import {
  AddFeeMutationResponse,
  MutationFeesArgs,
} from '../../types/resolvers-types';

import {ContextValue} from '../../types';
import {parseFeeSpec} from '../../utils';

export const addFeeConfigurationSpec = async (
  _root: unknown,
  args: MutationFeesArgs,
  context: ContextValue
): Promise<AddFeeMutationResponse> => {
  // context.dataSources.fees.initialize();
  // let response: unknown = null;
  try {
    // split incoming fee configuration specs
    const specs = args.FeeConfigurationSpec.split('\n');

    // transform each line in specs into document ready objects
    const feeSpec = specs.map(spec => parseFeeSpec(spec));

    // save fee specification to database
    await context.dataSources.fees?.insertMany(feeSpec);

    return {
      status: 'ok',
      code: 200,
      success: true,
      message: 'Successfully created fee configuration',
    };
  } catch (error: unknown) {
    console.error('====> Error Message:', error);
    // if (error instanceof ApolloError) {
    //   return {
    //     code: '500',
    //     success: false,
    //     message: error.message,
    //   };
    // } else {
    //   return {
    //     code: '501',
    //     success: false,
    //     message: 'FATAL ERROR: Error is not an instance of ApolloError',
    //   };
    // }

    // rethrow error for use in REST API
    throw error;
  }

  // return response;
};
