import * as yup from 'yup';
import { getValidationErrors } from './../utils/Validator';
import UserService from '../services/User';
import UserRepository from '../repositories/User';
import HandlerResponseException from '../utils/HandlerResponseExeption';
import AddressRepository from '../repositories/Address';
import ContactRepository from '../repositories/Contact';
import User from '../entities/User';

const userRepository = new UserRepository(new User('', '', new Date(), ''));
const addressRepository = new AddressRepository();
const contactRepository = new ContactRepository();
const userService = new UserService(
  userRepository,
  addressRepository,
  contactRepository,
);

export const create = async (event: { [key: string]: any }) => {
  const userSchema = yup.object({
    fullname: yup.string().required(),
    birthDate: yup.date().required(),
    active: yup.bool().required(),
    contacts: yup
      .array()
      .min(1)
      .required()
      .of(
        yup.object({
          type: yup.string().oneOf(['email', 'telephone']).required(),
          value: yup.string().required(),
          isMain: yup.boolean().required(),
        }),
      ),
    addresses: yup
      .array()
      .min(1)
      .required()
      .of(
        yup.object({
          street: yup.string().required(),
          number: yup.string().required(),
          neighborhood: yup.string().required(),
        }),
      ),
  });

  const body = JSON.parse(event.body || '{}');
  const validationErrors = await getValidationErrors(userSchema, body);
  if (validationErrors) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          errors: validationErrors,
        },
        null,
        2,
      ),
    };
  }

  try {
    const userIdCreated = await userService.create(body);

    return {
      statusCode: 201,
      body: JSON.stringify(
        {
          id: userIdCreated,
        },
        null,
        2,
      ),
    };
  } catch (error: any) {
    return HandlerResponseException.handle(error);
  }
};

export const findById = async (event: { [key: string]: any }) => {
  try {
    const id = event.pathParameters.id;
    const userReturned = await userService.findById(id);
    // @ts-ignore
    userReturned.sk = '';

    return {
      statusCode: 200,
      body: JSON.stringify(userReturned, null, 2),
    };
  } catch (error: any) {
    return HandlerResponseException.handle(error);
  }
};

export const findAll = async (event: { [key: string]: any }) => {
  try {
    const usersReturned = await userRepository.findAll();
    return {
      statusCode: 200,
      body: JSON.stringify(usersReturned, null, 2),
    };
  } catch (error: any) {
    return HandlerResponseException.handle(error);
  }
};

export const remove = async (event: { [key: string]: any }) => {
  try {
    const id = event.pathParameters.id;
    await userService.remove(id);

    return {
      statusCode: 204,
      body: JSON.stringify({}, null, 2),
    };
  } catch (error: any) {
    return HandlerResponseException.handle(error);
  }
};

export const update = async (event: { [key: string]: any }) => {
  try {
    const id = event.pathParameters.id;
    const userSchema = yup.object({
      fullname: yup.string().required(),
      birthDate: yup.date().required(),
      active: yup.bool().required(),
    });

    const body = JSON.parse(event.body || '{}');
    const validationErrors = await getValidationErrors(userSchema, body);
    if (validationErrors) {
      return {
        statusCode: 400,
        body: JSON.stringify(
          {
            errors: validationErrors,
          },
          null,
          2,
        ),
      };
    }

    await userService.update(id, body);

    return {
      statusCode: 204,
      body: JSON.stringify({}, null, 2),
    };
  } catch (error: any) {
    return HandlerResponseException.handle(error);
  }
};
