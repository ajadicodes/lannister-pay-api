import {ApolloError} from 'apollo-server-errors';
import dbConnect from '../dbConnect';
import {feeSpecModel} from '../models/feeSpec.model';
import {schema} from '../schema';

export const serverConfig = {
  schema,

  context: async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let models: any = null;

    if (!models) {
      models = {};
      try {
        await dbConnect();

        models.feeSpecModel = feeSpecModel;
      } catch (error: unknown) {
        if (error instanceof ApolloError)
          throw new ApolloError(error.message, 'DATABASE_ERROR');
        else throw new Error('Something went wrong.');
      }
    }

    return {models};
  },
};
