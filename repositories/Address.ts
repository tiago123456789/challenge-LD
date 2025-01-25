import Address from '../entities/Address';
import AddressRepositoryInterface from './Address.interface';

class AddressRepository implements AddressRepositoryInterface {
  async createInBatch(data: Array<Address>): Promise<void> {
    await data[0].createInBatch(data);
  }
}

export default AddressRepository;
