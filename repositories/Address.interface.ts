import Address from '../entities/Address';

interface AddressRepositoryInterface {
  createInBatch(data: Array<Address>): Promise<void>;
}

export default AddressRepositoryInterface;
