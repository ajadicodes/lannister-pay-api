import {PORT} from './config';
import bodyParser from 'body-parser';
import express from 'express';
import fastify from 'fastify';
import graphql from './servers/graphql';
import rest from './servers/rest';
import {serverConfig} from './servers/config';

(async () => {
  const app = fastify({
    logger: true,
  });
  // app.use(bodyParser.json());

  await graphql(app, serverConfig);
  rest(app, serverConfig);

  await app.listen(PORT);
  console.log(`🚀  Server ready http://localhost:${PORT}`);
})();
