import { useEffect, useState } from 'react';
import { useShop } from '../hooks/useShop';
import { useCustomersStore } from '../store/customersStore';
import { CustomerDebtCard } from '../components/credit/CustomerDebtCard';
import { CustomerCreditList } from '../components/credit/CustomerCreditList';
import { CreditPaymentForm } from '../components/credit/CreditPaymentForm';
import { CreditHistory } from '../components/credit/CreditHistory';
import type { Customer } from '../types';

export function CreditPage() {
  const { shop_id } = useShop();
  const customers = useCustomersStore((s) => s.customers);
  const payments = useCustomersStore((s) => s.payments);
  const fetchAll = useCustomersStore((s) => s.fetchAll);
  const recordPayment = useCustomersStore((s) => s.recordPayment);

  const [paymentTarget, setPaymentTarget] = useState<Customer | null>(null);
  const [historyTarget, setHistoryTarget] = useState<Customer | null>(null);

  useEffect(() => {
    if (shop_id) fetchAll(shop_id);
  }, [shop_id, fetchAll]);

  const totalDebt = customers.reduce((sum, c) => sum + c.current_debt, 0);
  const customerCount = customers.filter((c) => c.current_debt > 0).length;

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 max-w-2xl mx-auto flex flex-col gap-5">
      <h1 className="font-display font-bold text-xl">Crédits clients</h1>

      <CustomerDebtCard totalDebt={totalDebt} customerCount={customerCount} />

      <div>
        <h2 className="font-display font-semibold text-sm text-[var(--color-ink-soft)] mb-2.5">Clients avec ardoise</h2>
        <CustomerCreditList
          customers={customers}
          onSelect={(c) => setPaymentTarget(c)}
        />
      </div>

      <CreditPaymentForm
        customer={paymentTarget}
        onClose={() => setPaymentTarget(null)}
        onSubmit={(id, name, amount) => recordPayment(shop_id!, id, name, amount)}
      />

      <CreditHistory
        open={!!historyTarget}
        onClose={() => setHistoryTarget(null)}
        customerName={historyTarget?.name ?? ''}
        payments={payments.filter((p) => p.customer_id === historyTarget?.id)}
      />
    </div>
  );
}
