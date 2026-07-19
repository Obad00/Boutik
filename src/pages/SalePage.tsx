import { useEffect, useMemo, useState } from 'react';
import { useShop } from '../hooks/useShop';
import { useProductsStore } from '../store/productsStore';
import { useCustomersStore } from '../store/customersStore';
import { useCartStore } from '../store/cartStore';
import { useOrdersStore } from '../store/ordersStore';
import { useSettingsStore } from '../store/settingsStore';
import { usePrinter } from '../hooks/usePrinter';
import { ProductSearchBar } from '../components/sale/ProductSearchBar';
import { CategoryFilter } from '../components/sale/CategoryFilter';
import { ProductGrid } from '../components/sale/ProductGrid';
import { Cart } from '../components/sale/Cart';
import { CartDrawer } from '../components/sale/CartDrawer';
import { PaymentModal } from '../components/sale/PaymentModal';
import { Modal } from '../components/ui/Modal';
import { ReceiptCard } from '../components/receipt/ReceiptCard';
import type { PaymentMode } from '../types';

export function SalePage() {
  const { shop_id } = useShop();
  const products = useProductsStore((s) => s.products);
  const categories = useProductsStore((s) => s.categories);
  const fetchProducts = useProductsStore((s) => s.fetchAll);

  const customers = useCustomersStore((s) => s.customers);
  const fetchCustomers = useCustomersStore((s) => s.fetchAll);
  const createCustomer = useCustomersStore((s) => s.createCustomer);

  const settings = useSettingsStore((s) => s.settings);
  const fetchSettings = useSettingsStore((s) => s.fetch);

  const lines = useCartStore((s) => s.lines);
  const addProduct = useCartStore((s) => s.addProduct);
  const clearCart = useCartStore((s) => s.clear);
  const total = useCartStore((s) => s.total());

  const createOrder = useOrdersStore((s) => s.createOrder);
  const printer = usePrinter();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastOrder, setLastOrder] = useState<ReturnType<typeof useOrdersStore.getState>['lastOrder']>(null);

  useEffect(() => {
    if (!shop_id) return;
    fetchProducts(shop_id);
    fetchCustomers(shop_id);
    fetchSettings(shop_id);
  }, [shop_id, fetchProducts, fetchCustomers, fetchSettings]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !category || p.category_id === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  async function handleConfirmPayment(mode: PaymentMode, customer?: { id?: string; name: string; phone?: string }) {
    if (!shop_id) return;
    setSubmitting(true);
    try {
      let customer_id = customer?.id;
      let customer_name = customer?.name;
      if (mode === 'credit' && customer && !customer.id) {
        const created = await createCustomer(shop_id, { name: customer.name, phone: customer.phone });
        customer_id = created.id;
        customer_name = created.name;
      }
      const order = await createOrder(shop_id, {
        items: lines,
        total,
        payment_mode: mode,
        customer_id,
        customer_name,
      });
      setLastOrder(order);
      clearCart();
      setPaymentOpen(false);
      setReceiptOpen(true);
      await fetchProducts(shop_id);
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePrintBluetooth() {
    if (!lastOrder || !settings) return;
    if (!printer.isBluetoothSupported) {
      alert("Web Bluetooth n'est pas disponible sur ce navigateur. Utilisez Chrome ou Edge.");
      return;
    }
    const ok = await printer.printBluetooth(
      lastOrder,
      settings.shop_name,
      settings.address,
      settings.receipt_footer,
    );
    if (!ok) {
      alert(
        printer.error ??
          "L'impression Bluetooth a échoué. Vérifiez que l'imprimante est allumée et que le Bluetooth est activé.",
      );
    }
  }

  async function handlePrintWindow() {
    if (!lastOrder || !settings) return;
    try {
      await printer.printWindow(lastOrder, settings);
    } catch {
      alert(
        printer.error ??
          "Impossible d'ouvrir la fenetre d'impression.",
      );
    }
  }

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          <ProductSearchBar value={search} onChange={setSearch} />
          <CategoryFilter categories={categories} selected={category} onSelect={setCategory} />
          <ProductGrid products={filtered} onAdd={(p) => addProduct(p, 1)} />
        </div>

        <div className="hidden md:block w-[340px] shrink-0 sticky top-6 self-start bg-[var(--color-surface)] rounded-[var(--radius-card-lg)] shadow-[0_8px_30px_-8px_rgba(19,26,44,0.18)] p-5 h-[calc(100vh-3rem)]">
          <h2 className="font-display font-bold text-lg mb-4">Panier</h2>
          <div className="h-[calc(100%-2.5rem)]">
            <Cart onCheckout={() => setPaymentOpen(true)} />
          </div>
        </div>
      </div>

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} onCheckout={() => setPaymentOpen(true)} />

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={total}
        customers={customers}
        onConfirm={handleConfirmPayment}
        isSubmitting={submitting}
      />

      <Modal open={receiptOpen} onClose={() => setReceiptOpen(false)} title="Ticket de vente">
        {lastOrder && settings && (
          <ReceiptCard
            order={lastOrder}
            shopName={settings.shop_name}
            address={settings.address}
            footer={settings.receipt_footer}
            onPrintWindow={handlePrintWindow}
            isPrintingWindow={printer.isPrintingWindow}
            onPrintBluetooth={handlePrintBluetooth}
            isPrintingBluetooth={printer.isPrinting}
            isBluetoothSupported={printer.isBluetoothSupported}
            onDone={() => setReceiptOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}
