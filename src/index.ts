import {PORT} from './config';
import bodyParser from 'body-parser';
import express from 'express';
import graphql from './servers/graphql';
import rest from './servers/rest';
import {serverConfig} from './servers/config';

(async () => {
  const app = express();
  app.use(bodyParser.json());

  await graphql(app, serverConfig);
  rest(app, serverConfig);

  app.listen({port: PORT}, () => {
    console.log(`🚀  Server ready http://localhost:${PORT}`);
  });
})();
