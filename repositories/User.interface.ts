import User from '../entities/User';
import { ReturnAllUser } from '../types/ReturnAllUser';
import { ReturnUserData } from '../types/ReturnUserData';

interface UserRepositoryInterface {
  findAll(): Promise<Array<ReturnAllUser>>;
  create(data: User): Promise<string | undefined>;
  findById(id: string): Promise<ReturnUserData | null>;
  remove(id: string): Promise<void>;
  update(
    id: string,
    sk: string | undefined,
    dataToModify: { [key: string]: any },
  ): Promise<void>;
}

export default UserRepositoryInterface;
