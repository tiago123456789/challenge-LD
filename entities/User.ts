import { Base } from './Base';
import { getClient } from '../config/Dynamodb';
import { ReturnUserData } from '../types/ReturnUserData';
import { ContactItem } from '../types/ContactItem';
import { AddressItem } from '../types/AddressItem';
import { ReturnAllUser } from '../types/ReturnAllUser';

export default class User extends Base {
  constructor(
    private readonly id: string | undefined,
    private readonly fullname: string | undefined,
    private readonly birthDate: Date | undefined,
    private readonly active: string | undefined,
  ) {
    super();
  }

  getId(): string | undefined {
    return this.id;
  }

  get pk(): string {
    return `User#${this.id}`;
  }

  get sk(): string {
    const currentTmeInMilleseconds = new Date().getTime();
    return `User#${currentTmeInMilleseconds}`;
  }

  toItem(): Record<string, unknown> {
    return {
      ...this.keys(),
      fullname: { S: this.fullname },
      birthDate: { S: this.birthDate },
      active: { S: this.active },
    };
  }

  async findAll(): Promise<Array<ReturnAllUser>> {
    const client = getClient();
    const registers = await client
      .scan({
        // @ts-ignore
        TableName: process.env.TABLE_NAME,
        FilterExpression: 'begins_with(SK, :prefix)',
        ExpressionAttributeValues: {
          ':prefix': { S: 'User#' },
        },
      })
      .promise();

    if (registers.Items && registers.Items.length == 0) {
      return [];
    }

    const users: Array<ReturnAllUser> = [];

    // @ts-ignore
    for (let index = 0; index < registers?.Items?.length; index += 1) {
      // @ts-ignore
      const item = registers.Items[index];
      users.push({
        id: item?.PK?.S?.split('#')[1],
        birthDate: item?.birthDate?.S,
        fullname: item?.fullname?.S,
        active: Boolean(item?.active?.S),
      });
    }

    return users;
  }

  async remove(identification: string): Promise<void> {
    const client = getClient();

    const registers = await client
      .query({
        // @ts-ignore
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `User#${identification}` },
        },
      })
      .promise();

    if (!registers?.Items || registers.Items.length === 0) {
      return;
    }

    for (const item of registers?.Items) {
      await client
        .deleteItem({
          // @ts-ignore
          TableName: process.env.TABLE_NAME,
          Key: {
            PK: { S: item?.PK?.S },
            SK: { S: item?.SK?.S },
          },
        })
        .promise();
    }
  }

  async findById(identification: string): Promise<ReturnUserData | null> {
    const client = getClient();
    const registers = await client
      .query({
        // @ts-ignore
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': { S: `User#${identification}` },
        },
      })
      .promise();

    if (!registers?.Items || registers.Items.length === 0) {
      return null;
    }

    const addresses: Array<AddressItem> = [];
    const contacts: Array<ContactItem> = [];
    let user: { [key: string]: any } = {};

    for (let index = 0; index < registers.Items.length; index += 1) {
      const item = registers.Items[index];
      const isUser = item.SK.S?.startsWith('User');
      if (isUser) {
        user = item;
      }

      const isContact = item.SK.S?.startsWith('Contact');
      if (isContact) {
        contacts.push({
          type: item?.type?.S,
          isMain: Boolean(item?.isMain?.S),
          value: item?.value?.S,
        });
      }

      const isAddress = item.SK?.S?.startsWith('Address');
      if (isAddress) {
        addresses.push({
          neighborhood: item?.neighborhood?.S,
          number: item?.number?.S,
          street: item?.street?.S,
        });
      }
    }

    const id = user.PK.S?.split('#')[1];
    return {
      id,
      sk: user?.SK?.S,
      fullname: user?.fullname?.S,
      birthDate: user?.birthDate?.S,
      active: Boolean(user?.active?.S),
      contacts: contacts,
      addresses: addresses,
    };
  }

  async create(): Promise<string | undefined> {
    const client = getClient();
    // @ts-ignore
    await client
      .putItem({
        // @ts-ignore
        TableName: process.env.TABLE_NAME,
        Item: this.toItem(),
      })
      .promise();

    return this.id;
  }

  async update(identification: string, sk: string | undefined, user: User) {
    const client = getClient();
    const keys = this.keys();
    keys.PK.S = `User#${identification}`;
    keys.SK.S = sk;

    const updateExpression = [];
    const expressionAttributeNames: { [key: string]: any } = {};
    const expressionAttributeValues: { [key: string]: any } = {};

    if (user?.fullname) {
      updateExpression.push(' #fullname = :fullname');
      expressionAttributeNames['#fullname'] = 'fullname';
      expressionAttributeValues[':fullname'] = { S: user.fullname };
    }

    if (user?.birthDate) {
      updateExpression.push(' #birthDate = :birthDate');
      expressionAttributeNames['#birthDate'] = 'birthDate';
      expressionAttributeValues[':birthDate'] = { S: user.birthDate };
    }

    if ('active' in user) {
      updateExpression.push(' #active = :active');
      expressionAttributeNames['#active'] = 'active';
      expressionAttributeValues[':active'] = {
        B: `${user.active}`,
      };
    }

    // @ts-ignore
    await client
      .updateItem({
        // @ts-ignore
        TableName: process.env.TABLE_NAME,
        Key: keys,
        UpdateExpression: `SET ${updateExpression.join(' , ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      })
      .promise();
  }
}
