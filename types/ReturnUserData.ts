import { AddressItem } from '../types/AddressItem';
import { ContactItem } from '../types/ContactItem';

export interface ReturnUserData {
  id: string | undefined;
  sk?: string | undefined;
  fullname: string | undefined;
  birthDate: string | undefined;
  active: boolean | undefined;
  contacts: Array<ContactItem>;
  addresses: Array<AddressItem>;
}
