export interface Customer {
  id: string;
  shop_id: string;
  name: string;
  phone?: string;
  current_debt: number;
  created_at: string;
}

export interface CustomerInput {
  name: string;
  phone?: string;
}
