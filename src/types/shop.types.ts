export interface Shop {
  id: string;
  name: string;
  address: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

export interface Owner {
  id: string;
  shop_id: string;
  name: string;
  role: 'owner';
}

export interface AuthSession {
  shop: Shop;
  owner: Owner;
}
