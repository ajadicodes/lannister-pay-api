import {ApolloError} from 'apollo-server-errors';
import {ContextValue} from '../types';
import connectionToDB from '../utils/connectionToDB';
import {feeSpecModel} from '../models/feeSpec.model';
import {isEmpty} from 'lodash';
import {schema} from '../graphql/schema';

export const serverConfig = {
  schema,
  context: async (): Promise<ContextValue> => {
    const dataSources: any = {};
    if (isEmpty(dataSources)) {
      try {
        await connectionToDB();
        console.log('=== Successfully connected to database ===');

        dataSources['fees'] = feeSpecModel;
      } catch (error: any) {
        // throw new Error(error.message, 'DATABASE_ERROR')
        throw new ApolloError(error.message, 'DATABASE_CONNECTION_ERROR');
      }
    }

    return {dataSources};
  },
};
