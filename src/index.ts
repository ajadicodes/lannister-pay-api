import bodyParser from 'body-parser';
import express from 'express';
import graphql from './servers/graphql';
import rest from './servers/rest';
import {serverConfig} from './servers';

(async () => {
  const port = process.env.PORT || 4000;
  const app = express();
  app.use(bodyParser.json());

  await graphql(app, serverConfig);
  rest(app, serverConfig);

  app.listen({port}, () => {
    console.log(`🚀  Server ready http://localhost:${port}`);
  });
})();
