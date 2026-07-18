import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { RequireAuth } from './RequireAuth';
import { LoginPage } from '../pages/LoginPage';
import { SalePage } from '../pages/SalePage';
import { StockPage } from '../pages/StockPage';
import { CashPage } from '../pages/CashPage';
import { CreditPage } from '../pages/CreditPage';
import { SalesHistoryPage } from '../pages/SalesHistoryPage';
import { AdminDashboard } from '../pages/admin/AdminDashboard';
import { AdminProductsPage } from '../pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from '../pages/admin/AdminCategoriesPage';
import { AdminCustomersPage } from '../pages/admin/AdminCustomersPage';
import { AdminSettingsPage } from '../pages/admin/AdminSettingsPage';
import { SuperAdminPage } from '../pages/admin/SuperAdminPage';

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/superadmin', element: <SuperAdminPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppShell />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <SalePage /> },
      { path: 'stock', element: <StockPage /> },
      { path: 'caisse', element: <CashPage /> },
      { path: 'credits', element: <CreditPage /> },
      { path: 'historique', element: <SalesHistoryPage /> },
      {
        path: 'admin',
        element: <AdminDashboard />,
        children: [
          { path: 'produits', element: <AdminProductsPage /> },
          { path: 'categories', element: <AdminCategoriesPage /> },
          { path: 'clients', element: <AdminCustomersPage /> },
          { path: 'parametres', element: <AdminSettingsPage /> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
