import {graphql, rest} from './servers';

import {PORT} from './config';
import fastify from 'fastify';
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
