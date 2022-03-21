import {AddFeeMutationResponse, MutationFeesArgs} from '../resolvers-types';

import {FeeSpec} from '../types';
import {Model} from 'mongoose';
import {parseFeeSpec} from '../utils';

export const addFeeConfigurationSpec = async (
  _root: unknown,
  args: MutationFeesArgs,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context: {models: {feeSpecModel: Model<FeeSpec, {}, {}, {}>}}
): Promise<AddFeeMutationResponse> => {
  // let response: unknown = null;
  try {
    // split incoming fee configuration specs
    const specs = args.FeeConfigurationSpec.split('\n');

    // transform each line in specs into document ready objects
    const feeSpec = specs.map(spec => parseFeeSpec(spec));

    // save to database
    // await context.models.feeSpecModel.insertMany(feeSpec)

    // update fee specification if duplicate specID is found
    try {
      await context.models.feeSpecModel.insertMany(feeSpec, {
        ordered: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.code === 11000) {
        // get duplicates
        const spec: unknown[] = [];
        const specIDs = e.result.result.writeErrors.map((error: unknown) => {
          const parsedError = JSON.stringify(error);
          const parsedSpec = JSON.parse(parsedError).op;
          spec.push(parsedSpec);
          return parsedSpec.specID;
        });
        // remove -- the now stale -- duplicates
        await context.models.feeSpecModel.deleteMany({
          specID: {$in: specIDs},
        });
        // re-add fee specs that triggered duplicate error
        try {
          await context.models.feeSpecModel.insertMany(spec, {
            ordered: false,
          });
        } catch (e) {
          console.error('Error on inserting duplicates', e);
        }
      } else return Promise.reject(e);
    }

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
