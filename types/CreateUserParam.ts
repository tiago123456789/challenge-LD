import { ContactItem } from '../types/ContactItem';
import { AddressItem } from '../types/AddressItem';

export interface CreateUserParam {
  fullname: string | undefined;
  birthDate: Date | undefined;
  active: boolean | undefined;
  contacts: Array<ContactItem>;
  addresses: Array<AddressItem>;
}
