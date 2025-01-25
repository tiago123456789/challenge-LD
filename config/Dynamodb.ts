import { DynamoDB } from 'aws-sdk';

let client: DynamoDB | null = null;

const getClient = (): DynamoDB => {
  if (client) return client;

  let options: { [key: string]: any } = {
    httpOptions: {
      connectTimeout: 1000,
      timeout: 1000,
    },
  };

  if (process.env.NODE_ENV == 'dev') {
    options = {
      ...options,
      region: 'localhost',
      endpoint: 'http://0.0.0.0:8000',
      credentials: {
        accessKeyId: 'MockAccessKeyId',
        secretAccessKey: 'MockSecretAccessKey',
      },
    };
  }

  client = new DynamoDB(options);
  return client;
};

export { getClient };
