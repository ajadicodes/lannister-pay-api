import Fees from '../dataSources/fees';
import {feeSpecModel} from '../models/feeSpec.model';
import {schema} from '../graphql/schema';

export const serverConfig = {
  schema,

  context: {
    dataSources: {
      fees: new Fees(feeSpecModel),
    },
  },
};
