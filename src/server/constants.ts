import { config } from 'dotenv';

config({ path: '.env' });

export const ENV = {
  PORT: (process.env.PORT ?? 1717) as number,
  HOST: process.env.HOST ?? '0.0.0.0',
  WITHOUT_NGROK:
    process.env.WITHOUT_NGROK === 'true' || process.env.WITHOUT_NGROK === '1',
};
