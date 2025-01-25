import Contact from '../entities/Contact';

interface ContactRepositoryInterface {
  createInBatch(data: Array<Contact>): Promise<void>;
}

export default ContactRepositoryInterface;
