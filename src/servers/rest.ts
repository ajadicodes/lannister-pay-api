import {OpenAPI, useSofa} from 'sofa-api';

import {ContextValue} from 'sofa-api/types';
import {GraphQLSchema} from 'graphql';
import cors from 'cors';
import {resolve} from 'path';
import swaggerDocument from '../../swagger.json';
import swaggerUi from 'swagger-ui-express';

export default (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {schema, context}: {schema: GraphQLSchema; context: ContextValue}
) => {
  const openApi = OpenAPI({
    schema,
    info: {
      title: 'LannisterPay REST API',
      version: '1.0.0',
    },
  });

  const basePath = '';

  app.use(cors());

  app.use(
    basePath,
    useSofa({
      basePath,
      schema,
      context,
      onRoute(info) {
        openApi.addRoute(info, {basePath});
      },
      routes: {
        'Query.computeTransactionFee': {method: 'POST'},
      },
      errorHandler(errors) {
        // properly format error thrown in GraphQL operations for the
        if (errors[0].extensions.code === 'BAD_USER_INPUT') {
          if (errors[0].path[0] === 'computeTransactionFee')
            return {
              type: 'error',
              status: 400,
              error: {
                message: errors[0].message,
                code: 400,
                success: false,
                AppliedFeeID: null,
                AppliedFeeValue: null,
                ChargeAmount: null,
                SettlementAmount: null,
              },
            };
          if (errors[0].path[0] === 'fees')
            return {
              type: 'error',
              status: 400,
              error: {
                message: errors[0].message,
                code: 400,
                success: false,
              },
            };
        }
        return {
          type: 'error',
          status: 500,
          error: {message: errors[0].message},
        };
      },
    })
  );

  // writes every recorder route
  // openApi.save('../swagger.json');
  openApi.save(resolve(__dirname, '../../swagger.json'));
  openApi.save(resolve(__dirname, '../../swagger.yml'));

  // expose rest docs
  app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
