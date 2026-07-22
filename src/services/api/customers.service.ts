import type { ICustomersService } from '../interfaces';
import type { Customer, CustomerInput } from '../../types';
import { apiFetch } from './http';

class ApiCustomersService implements ICustomersService {
  async list(_shop_id: string): Promise<Customer[]> {
    return apiFetch<Customer[]>('/customers');
  }

  async get(shop_id: string, id: string): Promise<Customer | undefined> {
    // Pas de GET /customers/:id côté backend (fidèle au contrat Node de référence) —
    // jamais appelé par aucun store/page aujourd'hui.
    const customers = await this.list(shop_id);
    return customers.find((c) => c.id === id);
  }

  async create(_shop_id: string, input: CustomerInput): Promise<Customer> {
    return apiFetch<Customer>('/customers', { method: 'POST', body: input });
  }

  async update(_shop_id: string, id: string, input: Partial<CustomerInput>): Promise<Customer> {
    return apiFetch<Customer>(`/customers/${id}`, { method: 'PUT', body: input });
  }

  async remove(_shop_id: string, id: string): Promise<void> {
    await apiFetch<{ ok: true }>(`/customers/${id}`, { method: 'DELETE' });
  }

  async adjustDebt(_shop_id: string, _id: string, _delta: number): Promise<Customer> {
    // Aucune route backend n'expose un ajustement brut de la dette : les deux seuls
    // flux qui la modifient (vente à crédit, remboursement) le font côté serveur
    // dans leur propre transaction. Jamais appelé en pratique — voir orders.service.ts
    // et credit-payments.service.ts, qui n'appellent plus cette méthode côté API.
    throw new Error("adjustDebt n'est pas exposé par l'API — passe par une vente ou un remboursement");
  }
}

export const customersService = new ApiCustomersService();
