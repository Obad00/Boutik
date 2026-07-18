import { useAuthStore } from '../store/authStore';

export function useShop() {
  const session = useAuthStore((s) => s.session);
  return {
    shop: session?.shop ?? null,
    shop_id: session?.shop.id ?? null,
    owner: session?.owner ?? null,
    isAuthenticated: !!session,
  };
}
