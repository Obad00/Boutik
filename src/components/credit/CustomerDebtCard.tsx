import { Card } from '../ui/Card';

export function CustomerDebtCard({ totalDebt, customerCount }: { totalDebt: number; customerCount: number }) {
  return (
    <Card raised className="bg-gradient-to-br from-[var(--color-credit)] to-[#6D42D9] text-white">
      <p className="text-white/70 text-sm font-medium mb-1">Total des créances en cours</p>
      <p className="font-display font-extrabold text-4xl font-mono-num mb-1">
        {totalDebt.toLocaleString('fr-FR')} <span className="text-lg font-semibold opacity-60">FCFA</span>
      </p>
      <p className="text-white/60 text-xs">
        {customerCount} client{customerCount > 1 ? 's' : ''} avec une ardoise en cours
      </p>
    </Card>
  );
}
