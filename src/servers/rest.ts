import {OpenAPI, useSofa} from 'sofa-api';

import {ContextValue} from 'sofa-api/types';
import {GraphQLSchema} from 'graphql';
import cors from 'cors';
import {createSofaRouter} from 'sofa-api';
import getStream from 'get-stream';
import http from 'http';
import {resolve} from 'path';
import swaggerDocument from '../../swagger.json';
import swaggerUi from 'swagger-ui-express';

export default (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {schema, context}: {schema: GraphQLSchema; context: ContextValue}
) => {
  // const openApi = OpenAPI({
  //   schema,
  //   info: {
  //     title: 'LannisterPay REST API',
  //     version: '1.0.0',
  //   },
  // });
  const basePath = '';

  // app.use(cors());

  const invokeSofa = createSofaRouter({
    basePath: '',
    schema,
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
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.route({
    method: ['POST', 'GET'],
    url: '*',
    handler: async function (req: any, res: any) {
      console.log('===== working =====');
      console.log('REQ', req.body);

      try {
        const response = await invokeSofa({
          method: req.method,
          url: req.url,
          body: req.body,
          contextValue:
            typeof context === 'function' ? await context() : context,
        });

        console.log('RESPONSE:', response);
        if (response) {
          const headers = {
            'Content-Type': 'application/json',
          };

          res.code = response.status;
          res.headers = headers;

          if (response.type === 'result') {
            res.send(JSON.stringify(response.body));
          }
          if (response.type === 'error') {
            res.send(JSON.stringify(response.error));
          }
        } else {
          res.code = 404;
          res.send();
        }
      } catch (error) {
        res.code = 500;
        res.send(JSON.stringify(error));
      }
    },
  });

  // writes every recorder route
  // openApi.save(resolve(__dirname, '../../swagger.json'));
  // openApi.save(resolve(__dirname, '../../swagger.yml'));

  // expose rest docs
  // app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};
