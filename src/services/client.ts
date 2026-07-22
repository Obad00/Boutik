// Point d'entrée unique de la couche data.
// Implémentations api/* qui appellent le backend Laravel via fetch — voir api/http.ts
// pour la configuration de l'URL de base et de l'authentification par token.

export { productsService } from './api/products.service';
export { categoriesService } from './api/categories.service';
export { customersService } from './api/customers.service';
export { ordersService } from './api/orders.service';
export { stockMovementsService } from './api/stock-movements.service';
export { cashMovementsService } from './api/cash-movements.service';
export { creditPaymentsService } from './api/credit-payments.service';
export { settingsService } from './api/settings.service';
export { authService } from './api/auth.service';
export { shopsService } from './api/shops.service';
export { superadminAuthService } from './api/superadmin-auth.service';
export { platformStatsService } from './api/platform-stats.service';

// Codes de démonstration pré-créés (voir boutik-backend-laravel/database/seeders/DemoDataSeeder.php).
// De nouvelles boutiques créées par le superadmin viennent s'ajouter dynamiquement.
export const AVAILABLE_DEMO_CODES = ['SANDAGA', 'THIES'];
