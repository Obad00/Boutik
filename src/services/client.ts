// Point d'entrée unique de la couche data.
// Aujourd'hui : implémentations mock en mémoire.
// Demain : remplacer chaque import ci-dessous par l'équivalent dans ./supabase/*
// sans toucher aux composants, hooks ou stores qui consomment ces services.

export { productsService } from './mock/products.service';
export { categoriesService } from './mock/categories.service';
export { customersService } from './mock/customers.service';
export { ordersService } from './mock/orders.service';
export { stockMovementsService } from './mock/stock-movements.service';
export { cashMovementsService } from './mock/cash-movements.service';
export { creditPaymentsService } from './mock/credit-payments.service';
export { settingsService } from './mock/settings.service';
export { authService } from './mock/auth.service';
export { shopsService } from './mock/shops.service';

// Codes de démonstration pré-créés (voir services/mock/db.ts).
// De nouvelles boutiques créées par le superadmin viennent s'ajouter dynamiquement.
export const AVAILABLE_DEMO_CODES = ['SANDAGA', 'THIES'];
