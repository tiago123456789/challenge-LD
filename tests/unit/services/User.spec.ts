import ErrorCodeMessage from '../../../config/ErrorCodeMessage';
import AddressRepositoryInterface from '../../../repositories/Address.interface';
import ContactRepositoryInterface from '../../../repositories/Contact.interface';
import UserRepositoryInterface from '../../../repositories/User.interface';
import UserService from '../../../services/User';
import { randomUUID } from 'crypto';

describe('UserService unit tests', () => {
  let userRepository: jest.Mocked<UserRepositoryInterface>;
  let contactRepository: jest.Mocked<ContactRepositoryInterface>;
  let addressRepository: jest.Mocked<AddressRepositoryInterface>;

  beforeEach(() => {
    userRepository = {
      create: jest.fn(),
      remove: jest.fn(),
      update: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
    };

    contactRepository = {
      createInBatch: jest.fn(),
    };

    addressRepository = {
      createInBatch: jest.fn(),
    };
  });

  it('Should return list of users', async () => {
    userRepository.findAll.mockResolvedValue([]);
    const userService = new UserService(
      userRepository,
      addressRepository,
      contactRepository,
    );

    const results = await userService.findAll();
    expect(results.length).toBe(0);
  });

  it('Should return a list of users has 1 item', async () => {
    const fakeData = {
      id: randomUUID(),
      active: true,
      fullname: 'Test',
      birthDate: '1999-12-01',
    };
    userRepository.findAll.mockResolvedValue([fakeData]);
    const userService = new UserService(
      userRepository,
      addressRepository,
      contactRepository,
    );

    const results = await userService.findAll();
    expect(results.length).toBe(1);
    expect(results[0]).toBe(fakeData);
  });

  it('Should be return user when try to get by id', async () => {
    const fakeData = {
      id: randomUUID(),
      sk: `User#${Date.now()}`,
      active: true,
      fullname: 'Test',
      birthDate: '1999-12-01',
      contacts: [],
      addresses: [],
    };
    userRepository.findById.mockResolvedValue(fakeData);
    const userService = new UserService(
      userRepository,
      addressRepository,
      contactRepository,
    );

    const result = await userService.findById(fakeData.id);
    expect(result).toBe(fakeData);
  });

  it('Should be throw exception when try get user by id, but user not found', async () => {
    try {
      userRepository.findById.mockResolvedValue(null);
      const userService = new UserService(
        userRepository,
        addressRepository,
        contactRepository,
      );

      await userService.findById(randomUUID());
    } catch (error: any) {
      expect(error.message).toBe(ErrorCodeMessage.USER_NOT_FOUND);
    }
  });

  it('Should be remove user with success', async () => {
    const fakeData = {
      id: randomUUID(),
      sk: `User#${Date.now()}`,
      active: true,
      fullname: 'Test',
      birthDate: '1999-12-01',
      contacts: [],
      addresses: [],
    };
    userRepository.findById.mockResolvedValue(fakeData);
    const userService = new UserService(
      userRepository,
      addressRepository,
      contactRepository,
    );

    await userService.remove(fakeData.id);
    expect(userRepository.remove).toHaveBeenCalledTimes(1);
  });

  it('Should be throw exception when try remove user by id, but user not found', async () => {
    try {
      userRepository.findById.mockResolvedValue(null);
      const userService = new UserService(
        userRepository,
        addressRepository,
        contactRepository,
      );

      await userService.remove(randomUUID());
    } catch (error: any) {
      expect(error.message).toBe(ErrorCodeMessage.USER_NOT_FOUND);
    }
  });

  it('Should be update user with success', async () => {
    const fakeData = {
      id: randomUUID(),
      sk: `User#${Date.now()}`,
      active: true,
      fullname: 'Test',
      birthDate: '1999-12-01',
      contacts: [],
      addresses: [],
    };
    userRepository.findById.mockResolvedValue(fakeData);
    const userService = new UserService(
      userRepository,
      addressRepository,
      contactRepository,
    );

    await userService.update(fakeData.id, {
      active: fakeData.active,
      addresses: fakeData.addresses,
      contacts: fakeData.contacts,
      birthDate: new Date(fakeData.birthDate),
      fullname: fakeData.fullname,
    });
    expect(userRepository.update).toHaveBeenCalledTimes(1);
  });

  it('Should be throw exception when try update user by id, but user not found', async () => {
    try {
      userRepository.findById.mockResolvedValue(null);
      const userService = new UserService(
        userRepository,
        addressRepository,
        contactRepository,
      );

      await userService.update(randomUUID(), {
        active: true,
        addresses: [],
        birthDate: new Date(),
        contacts: [],
        fullname: 'Test',
      });
    } catch (error: any) {
      expect(error.message).toBe(ErrorCodeMessage.USER_NOT_FOUND);
    }
  });

  it('Should be throw exception when create without set a contact as the main contact', async () => {
    try {
      const userService = new UserService(
        userRepository,
        addressRepository,
        contactRepository,
      );

      await userService.create({
        active: true,
        birthDate: new Date('1999-01-01'),
        fullname: 'Test',
        addresses: [],
        contacts: [
          {
            isMain: false,
            type: 'email',
            value: 'test@gmail.com',
          },
        ],
      });
    } catch (error: any) {
      expect(error.message).toBe(ErrorCodeMessage.NEED_SET_ONE_CONTACT_MAIN);
    }
  });

  it('Should be throw exception when create and set more than 1 contact as the main contact', async () => {
    try {
      const userService = new UserService(
        userRepository,
        addressRepository,
        contactRepository,
      );

      await userService.create({
        active: true,
        birthDate: new Date('1999-01-01'),
        fullname: 'Test',
        addresses: [
          {
            neighborhood: 'Test',
            number: '123',
            street: 'Test',
          },
        ],
        contacts: [
          {
            isMain: true,
            type: 'email',
            value: 'test@gmail.com',
          },
          {
            isMain: true,
            type: 'telephone',
            value: 'test@gmail.com',
          },
        ],
      });
    } catch (error: any) {
      expect(error.message).toBe(
        ErrorCodeMessage.MORE_THAN_ONE_CONTACT_SETTED_MAIN,
      );
    }
  });

  it('Should be create user with success', async () => {
    const userService = new UserService(
      userRepository,
      addressRepository,
      contactRepository,
    );

    await userService.create({
      active: true,
      birthDate: new Date('1999-01-01'),
      fullname: 'Test',
      addresses: [
        {
          neighborhood: 'Test',
          number: '123',
          street: 'Test',
        },
      ],
      contacts: [
        {
          isMain: true,
          type: 'email',
          value: 'test@gmail.com',
        },
      ],
    });

    expect(userRepository.create).toBeCalledTimes(1);
    expect(addressRepository.createInBatch).toBeCalledTimes(1);
    expect(contactRepository.createInBatch).toBeCalledTimes(1);
  });
});
