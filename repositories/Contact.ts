import Contact from '../entities/Contact';
import ContactRepositoryInterface from './Contact.interface';

class ContactRepository implements ContactRepositoryInterface {
  async createInBatch(data: Array<Contact>): Promise<void> {
    await data[0].createInBatch(data);
  }
}

export default ContactRepository;
