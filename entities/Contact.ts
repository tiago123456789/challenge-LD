import { Base } from './Base';
import { getClient } from '../config/Dynamodb';

export default class Contact extends Base {
  constructor(
    private readonly id: string | undefined,
    private readonly userId: string | undefined,
    private readonly type: string | undefined,
    private readonly value: string | undefined,
    private readonly isMain: string | undefined,
  ) {
    super();
  }

  get pk(): string {
    return `User#${this.userId}`;
  }

  get sk(): string {
    const currentTmeInMilleseconds = new Date().getTime();
    return `Contact#${this.id}#${currentTmeInMilleseconds}`;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      type: { S: this.type },
      value: { S: this.value },
      isMain: { S: this.isMain },
    };
  }

  async createInBatch(contacts: Array<Contact>): Promise<void> {
    const client = getClient();

    const itemsToSave = contacts.map(item => ({
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
