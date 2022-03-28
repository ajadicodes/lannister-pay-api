import Fastify from 'fastify';
import {PORT} from './config';
import bodyParser from 'body-parser';
import express from 'express';
import graphql from './servers/graphql';
import rest from './servers/rest';
import {serverConfig} from './servers/config';

(async () => {
  const app = Fastify();
  // app.use(bodyParser.json());

  graphql(app, serverConfig);
  // rest(app, serverConfig);

  app.listen(PORT);
  console.log(`🚀  Server ready http://localhost:${PORT}`);
})();
