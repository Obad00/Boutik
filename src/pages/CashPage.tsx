import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useShop } from '../hooks/useShop';
import { useCashStore } from '../store/cashStore';
import { CashSummaryCard } from '../components/cash/CashSummaryCard';
import { CashMovementForm } from '../components/cash/CashMovementForm';
import { CashMovementHistory } from '../components/cash/CashMovementHistory';
import { Button } from '../components/ui/Button';

export function CashPage() {
  const { shop_id } = useShop();
  const movements = useCashStore((s) => s.movements);
  const fetchAll = useCashStore((s) => s.fetchAll);
  const recordMovement = useCashStore((s) => s.recordMovement);
  const todayBalance = useCashStore((s) => s.todayBalance());
  const todayIn = useCashStore((s) => s.todayIn());
  const todayOut = useCashStore((s) => s.todayOut());

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (shop_id) fetchAll(shop_id);
  }, [shop_id, fetchAll]);

  const todayMovements = movements.filter((m) => m.created_at.slice(0, 10) === new Date().toISOString().slice(0, 10));

  return (
    <div className="px-4 md:px-6 pt-4 md:pt-6 pb-4 max-w-2xl mx-auto flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-bold text-xl">Caisse</h1>
        <Button size="sm" icon={<Plus size={16} />} onClick={() => setFormOpen(true)}>
          Mouvement
        </Button>
      </div>

      <CashSummaryCard balance={todayBalance} cashIn={todayIn} cashOut={todayOut} />

      <div>
        <h2 className="font-display font-semibold text-sm text-[var(--color-ink-soft)] mb-2.5">Aujourd'hui</h2>
        <CashMovementHistory movements={todayMovements} />
      </div>

      <CashMovementForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(type, amount, reason) => recordMovement(shop_id!, type, amount, reason)}
      />
    </div>
  );
}
