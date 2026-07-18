export const APP_NAME = 'Boutik';

export const NAV_ITEMS = [
  { key: 'sale', label: 'Vente', path: '/', icon: 'ShoppingCart' },
  { key: 'stock', label: 'Stock', path: '/stock', icon: 'Package' },
  { key: 'cash', label: 'Caisse', path: '/caisse', icon: 'Wallet' },
  { key: 'credit', label: 'Crédits', path: '/credits', icon: 'HandCoins' },
  { key: 'history', label: 'Historique', path: '/historique', icon: 'History' },
] as const;
