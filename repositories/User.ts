import User from '../entities/User';
import { ReturnAllUser } from '../types/ReturnAllUser';
import { ReturnUserData } from '../types/ReturnUserData';
import UserRepositoryInterface from './User.interface';

class UserRepository implements UserRepositoryInterface {
  constructor(private readonly entity: User) {}

  findById(id: string): Promise<ReturnUserData | null> {
    return this.entity.findById(id);
  }

  async create(data: User): Promise<string | undefined> {
    return data.create();
  }

  remove(id: string): Promise<void> {
    return this.entity.remove(id);
  }

  update(
    id: string,
    sk: string | undefined,
    dataToModify: { [key: string]: any },
  ): Promise<void> {
    const user = new User(
      dataToModify?.id,
      dataToModify?.fullname,
      dataToModify?.birthDate,
      dataToModify?.active,
    );
    return this.entity.update(id, sk, user);
  }

  findAll(): Promise<Array<ReturnAllUser>> {
    return this.entity.findAll();
  }
}

export default UserRepository;
