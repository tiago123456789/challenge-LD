import User from '../entities/User';
import UserRepositoryInterface from '../repositories/User.interface';
import AddressRepositoryInterface from '../repositories/Address.interface';
import Address from '../entities/Address';
import Contact from '../entities/Contact';
import ContactRepositoryInterface from '../repositories/Contact.interface';
import { randomUUID } from 'crypto';
import ErrorCodeMessage from '../config/ErrorCodeMessage';
import { ContactItem } from '../types/ContactItem';
import { CreateUserParam } from '../types/CreateUserParam';
import { ReturnUserData } from '../types/ReturnUserData';
import { ReturnAllUser } from '../types/ReturnAllUser';

class UserService {
  constructor(
    private readonly userRepository: UserRepositoryInterface,
    private readonly addressRepository: AddressRepositoryInterface,
    private readonly contactRepository: ContactRepositoryInterface,
  ) {}

  private hasContactIsMainTrue(contacts: Array<ContactItem>): boolean {
    for (let index = 0; index < contacts.length; index += 1) {
      if (contacts[0].isMain) {
        return true;
      }
    }

    return false;
  }

  private hasMoreThan1ContactIsMainTrue(contacts: Array<ContactItem>): boolean {
    let hasContactIsMainTrue = false;
    for (let index = 0; index < contacts.length; index += 1) {
      if (hasContactIsMainTrue && contacts[index].isMain) {
        return true;
      }

      if (contacts[index].isMain) {
        hasContactIsMainTrue = true;
      }
    }

    return false;
  }

  findAll(): Promise<Array<ReturnAllUser>> {
    return this.userRepository.findAll();
  }

  async create(params: CreateUserParam): Promise<string | undefined> {
    if (!this.hasContactIsMainTrue(params.contacts)) {
      throw new Error(ErrorCodeMessage.NEED_SET_ONE_CONTACT_MAIN);
    }

    if (this.hasMoreThan1ContactIsMainTrue(params.contacts)) {
      throw new Error(ErrorCodeMessage.MORE_THAN_ONE_CONTACT_SETTED_MAIN);
    }

    const user = new User(
      randomUUID(),
      params.fullname,
      params.birthDate,
      `${params?.active}`,
    );

    const addresses = params?.addresses.map((item: { [key: string]: any }) => {
      return new Address(
        randomUUID(),
        user.getId(),
        item.street,
        item.number,
        item.neighborhood,
      );
    });

    const contacts = params?.contacts.map((item: { [key: string]: any }) => {
      return new Contact(
        randomUUID(),
        user.getId(),
        item.type,
        item.value,
        `${item.isMain}`,
      );
    });

    const [userIdCreated] = await Promise.all([
      this.userRepository.create(user),
      this.addressRepository.createInBatch(addresses),
      this.contactRepository.createInBatch(contacts),
    ]);

    return userIdCreated;
  }

  async findById(id: string): Promise<ReturnUserData | null> {
    const register = await this.userRepository.findById(id);
    if (!register) {
      throw new Error(ErrorCodeMessage.USER_NOT_FOUND);
    }

    return register;
  }

  async remove(id: string): Promise<void> {
    const register = await this.userRepository.findById(id);
    if (!register) {
      throw new Error(ErrorCodeMessage.USER_NOT_FOUND);
    }

    return this.userRepository.remove(id);
  }

  async update(id: string, dataToModify: CreateUserParam): Promise<void> {
    const register = await this.userRepository.findById(id);
    if (!register) {
      throw new Error(ErrorCodeMessage.USER_NOT_FOUND);
    }

    return this.userRepository.update(id, register.sk, dataToModify);
  }
}

export default UserService;
