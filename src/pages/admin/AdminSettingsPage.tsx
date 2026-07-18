import { useEffect } from 'react';
import { useShop } from '../../hooks/useShop';
import { useSettingsStore } from '../../store/settingsStore';
import { ShopSettingsForm } from '../../components/admin/ShopSettingsForm';

export function AdminSettingsPage() {
  const { shop_id } = useShop();
  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetch);
  const update = useSettingsStore((s) => s.update);

  useEffect(() => {
    if (shop_id) fetchSettings(shop_id);
  }, [shop_id, fetchSettings]);

  if (!settings) return null;

  return <ShopSettingsForm settings={settings} onSubmit={(input) => update(shop_id!, input)} />;
}
