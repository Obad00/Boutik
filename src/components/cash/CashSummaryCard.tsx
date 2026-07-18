import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Card } from '../ui/Card';

export function CashSummaryCard({ balance, cashIn, cashOut }: { balance: number; cashIn: number; cashOut: number }) {
  return (
    <Card raised className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-light)] text-white">
      <p className="text-white/60 text-sm font-medium mb-1">Solde de caisse aujourd'hui</p>
      <p className="font-display font-extrabold text-4xl font-mono-num mb-5">
        {balance.toLocaleString('fr-FR')} <span className="text-lg font-semibold opacity-60">FCFA</span>
      </p>
      <div className="flex gap-3">
        <div className="flex-1 bg-white/10 rounded-2xl p-3.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-cash-in)]/25 flex items-center justify-center shrink-0">
            <ArrowUpRight size={16} className="text-[#5CE0A0]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-white/50">Entrées</p>
            <p className="font-mono-num font-semibold text-sm truncate">{cashIn.toLocaleString('fr-FR')}</p>
          </div>
        </div>
        <div className="flex-1 bg-white/10 rounded-2xl p-3.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[var(--color-cash-out)]/25 flex items-center justify-center shrink-0">
            <ArrowDownRight size={16} className="text-[#FF8A8D]" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] text-white/50">Sorties</p>
            <p className="font-mono-num font-semibold text-sm truncate">{cashOut.toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
