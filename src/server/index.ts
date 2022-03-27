import express from 'express';
import ngrok from 'ngrok';
import { join } from 'path';
import { ENV } from './constants';
import { logger } from '../helpers/logger';
import jpackage from '../helpers/packageInfo';

const server = express();

const publicPath = join(__dirname, '../../public');
server.use(express.static(publicPath));
server.get('/', (_, resp) => {
  resp.json({
    name: jpackage.name,
    version: jpackage.version,
  });
});

server.listen(ENV.PORT, ENV.HOST, async () => {
  logger.info(`running on ${ENV.HOST}:${ENV.PORT}`);
  logger.info(`Public path: ${publicPath}`);

  if (ENV.WITHOUT_NGROK) return;

  const url = await ngrok.connect({
    addr: ENV.PORT,
  });

  logger.info(`Ngrok running on ${url}`);
});
