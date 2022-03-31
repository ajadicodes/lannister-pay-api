import {ApolloError} from 'apollo-server-errors';
import {DataSources} from '../types';
import connectionToDB from '../utils/connectionToDB';
import {feeSpecModel} from '../models/feeSpec.model';
import {schema} from '../graphql/schema';

export const serverConfig = {
  schema,

  context: async () => {
    const dataSources: DataSources = {
      fees: undefined,
    };

    try {
      // connect to db
      await connectionToDB();

      dataSources.fees = feeSpecModel;
    } catch (error) {
      throw new ApolloError(
        'Could not connect to database',
        'DATABASE_CONNECTION_ERROR'
      );
    }

    return {dataSources};
  },
};
