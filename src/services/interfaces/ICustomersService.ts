import type { Customer, CustomerInput } from '../../types';

export interface ICustomersService {
  list(shop_id: string): Promise<Customer[]>;
  get(shop_id: string, id: string): Promise<Customer | undefined>;
  create(shop_id: string, input: CustomerInput): Promise<Customer>;
  update(shop_id: string, id: string, input: Partial<CustomerInput>): Promise<Customer>;
  remove(shop_id: string, id: string): Promise<void>;
  adjustDebt(shop_id: string, id: string, delta: number): Promise<Customer>;
}
