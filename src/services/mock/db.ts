import type {
  Shop,
  Category,
  Product,
  Customer,
  Order,
  StockMovement,
  CashMovement,
  CreditPayment,
  ShopSettings,
} from '../../types';

export function uid(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

interface Database {
  shops: Shop[];
  categories: Category[];
  products: Product[];
  customers: Customer[];
  orders: Order[];
  stockMovements: StockMovement[];
  cashMovements: CashMovement[];
  creditPayments: CreditPayment[];
  settings: ShopSettings[];
  shopCodes: Record<string, string>; // code boutique -> shop_id (géré par le superadmin)
}

const SHOP_A = 'shop_demo_dakar';
const SHOP_B = 'shop_demo_thies';

const catA = {
  boissons: uid('cat'),
  epicerie: uid('cat'),
  menage: uid('cat'),
  hygiene: uid('cat'),
};

const catB = {
  boissons: uid('cat'),
  epicerie: uid('cat'),
};

function seedProductsA(): Product[] {
  const list: Array<[string, number, number | undefined, string, Product['unit'], number, number]> = [
    ['Coca-Cola 33cl', 300, 250, catA.boissons, 'piece', 48, 12],
    ['Eau minérale 1.5L', 400, 320, catA.boissons, 'piece', 36, 10],
    ['Jus Youki 1L', 900, 700, catA.boissons, 'piece', 18, 6],
    ['Riz brisé parfumé', 450, 380, catA.epicerie, 'kg', 120, 20],
    ['Huile Diamaraf 1L', 1200, 1050, catA.epicerie, 'litre', 24, 8],
    ['Sucre en poudre', 600, 520, catA.epicerie, 'kg', 40, 10],
    ['Lait en poudre Nido', 3500, 3100, catA.epicerie, 'boite', 15, 5],
    ['Sachet lait caillé', 200, 150, catA.epicerie, 'sachet', 60, 15],
    ['Savon Palmida', 350, 280, catA.hygiene, 'piece', 30, 8],
    ['Détergent Omo 1kg', 1500, 1300, catA.menage, 'piece', 20, 6],
    ['Eau de Javel 1L', 700, 580, catA.menage, 'litre', 3, 8],
    ['Carton Maggi cube', 2500, 2100, catA.epicerie, 'carton', 10, 3],
    ['Allumettes', 100, 70, catA.menage, 'piece', 50, 10],
    ['Pain de mie', 1000, 800, catA.epicerie, 'piece', 8, 5],
    ['Concentré tomate', 250, 200, catA.epicerie, 'sachet', 2, 10],
  ];
  return list.map(([name, price_sell, price_buy, category_id, unit, stock_quantity, stock_alert_threshold]) => ({
    id: uid('prod'),
    shop_id: SHOP_A,
    name,
    price_sell,
    price_buy,
    category_id,
    unit,
    stock_quantity,
    stock_alert_threshold,
    created_at: nowISO(),
  }));
}

function seedProductsB(): Product[] {
  const list: Array<[string, number, number | undefined, string, Product['unit'], number, number]> = [
    ['Fanta Orange 33cl', 300, 250, catB.boissons, 'piece', 30, 10],
    ['Riz brisé parfumé', 450, 380, catB.epicerie, 'kg', 80, 20],
    ['Sucre en poudre', 600, 520, catB.epicerie, 'kg', 25, 10],
  ];
  return list.map(([name, price_sell, price_buy, category_id, unit, stock_quantity, stock_alert_threshold]) => ({
    id: uid('prod'),
    shop_id: SHOP_B,
    name,
    price_sell,
    price_buy,
    category_id,
    unit,
    stock_quantity,
    stock_alert_threshold,
    created_at: nowISO(),
  }));
}

const customersA: Customer[] = [
  { id: uid('cust'), shop_id: SHOP_A, name: 'Fatou Diop', phone: '77 123 45 67', current_debt: 4500, created_at: nowISO() },
  { id: uid('cust'), shop_id: SHOP_A, name: 'Moussa Sarr', phone: '76 987 65 43', current_debt: 12000, created_at: nowISO() },
  { id: uid('cust'), shop_id: SHOP_A, name: 'Aïda Ndiaye', current_debt: 0, created_at: nowISO() },
];

const customersB: Customer[] = [
  { id: uid('cust'), shop_id: SHOP_B, name: 'Ibrahima Fall', phone: '70 111 22 33', current_debt: 2000, created_at: nowISO() },
];

export const db: Database = {
  shops: [
    { id: SHOP_A, name: 'Boutik Sandaga', address: 'Marché Sandaga, Dakar', phone: '33 821 00 00', created_at: nowISO() },
    { id: SHOP_B, name: 'Boutik Thiès Centre', address: 'Avenue Général de Gaulle, Thiès', phone: '33 951 00 00', created_at: nowISO() },
  ],
  categories: [
    { id: catA.boissons, shop_id: SHOP_A, name: 'Boissons' },
    { id: catA.epicerie, shop_id: SHOP_A, name: 'Épicerie' },
    { id: catA.menage, shop_id: SHOP_A, name: 'Ménage' },
    { id: catA.hygiene, shop_id: SHOP_A, name: 'Hygiène' },
    { id: catB.boissons, shop_id: SHOP_B, name: 'Boissons' },
    { id: catB.epicerie, shop_id: SHOP_B, name: 'Épicerie' },
  ],
  products: [...seedProductsA(), ...seedProductsB()],
  customers: [...customersA, ...customersB],
  orders: [],
  stockMovements: [],
  cashMovements: [],
  creditPayments: [],
  settings: [
    { id: uid('set'), shop_id: SHOP_A, shop_name: 'Boutik Sandaga', address: 'Marché Sandaga, Dakar', phone: '33 821 00 00', receipt_footer: 'Merci de votre visite !', admin_pin: '1234' },
    { id: uid('set'), shop_id: SHOP_B, shop_name: 'Boutik Thiès Centre', address: 'Avenue Général de Gaulle, Thiès', phone: '33 951 00 00', receipt_footer: 'Merci de votre visite !', admin_pin: '1234' },
  ],
  shopCodes: { SANDAGA: SHOP_A, THIES: SHOP_B },
};

export const PLATFORM_CONFIG = {
  superadmin_pin: '9999',
};

export function slugifyToCode(name: string): string {
  const base = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 10);
  return base || 'BOUTIK';
}

export function generateUniqueShopCode(name: string): string {
  const base = slugifyToCode(name);
  let code = base;
  let suffix = 1;
  while (db.shopCodes[code]) {
    suffix += 1;
    code = `${base}${suffix}`;
  }
  return code;
}
