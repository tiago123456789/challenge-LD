import { Base } from './Base';
import { getClient } from '../config/Dynamodb';

export default class Address extends Base {
  constructor(
    private readonly id: string | undefined,
    private readonly userId: string | undefined,
    private readonly street: string | undefined,
    private readonly number: string | undefined,
    private readonly neighborhood: string | undefined,
  ) {
    super();
  }

  get pk(): string {
    return `User#${this.userId}`;
  }

  get sk(): string {
    const currentTmeInMilleseconds = new Date().getTime();
    return `Address#${this.id}#${currentTmeInMilleseconds}`;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      street: { S: this.street },
      number: { S: this.number },
      neighborhood: { S: this.neighborhood },
    };
  }

  async createInBatch(addresses: Array<Address>): Promise<void> {
    const client = getClient();

    const itemsToSave = addresses.map(item => ({
      PutRequest: {
        Item: item.toItem(),
      },
    }));

    const params = {
      RequestItems: {
        // @ts-ignore
        [process.env.TABLE_NAME]: itemsToSave,
      },
    };

    const result = await client.batchWriteItem(params).promise();

    if (
      result.UnprocessedItems &&
      Object.keys(result.UnprocessedItems).length > 0
    ) {
      throw new Error('Retrying unprocessed items:', result.UnprocessedItems);
    }
  }
}
