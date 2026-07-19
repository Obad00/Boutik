import { Printer, Bluetooth, Check } from 'lucide-react';
import type { Order } from '../../types';
import { formatFCFA } from '../../lib/currency';
import { Button } from '../ui/Button';

interface Props {
  order: Order;
  shopName: string;
  address: string;
  footer?: string;
  /** Impression via la boîte de dialogue système (USB, réseau, AirPrint…). */
  onPrintWindow: () => void;
  isPrintingWindow?: boolean;
  /** Impression ESC/POS via Web Bluetooth. */
  onPrintBluetooth: () => void;
  isPrintingBluetooth?: boolean;
  /** False si le navigateur ne supporte pas Web Bluetooth. */
  isBluetoothSupported?: boolean;
  onDone: () => void;
}

export function ReceiptCard({
  order,
  shopName,
  address,
  footer,
  onPrintWindow,
  isPrintingWindow = false,
  onPrintBluetooth,
  isPrintingBluetooth = false,
  isBluetoothSupported = true,
  onDone,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      {/* Confirmation */}
      <div className="flex flex-col items-center gap-2 py-2">
        <div className="w-14 h-14 rounded-full bg-[var(--color-cash-in-soft)] flex items-center justify-center">
          <Check size={26} className="text-[var(--color-cash-in)]" strokeWidth={3} />
        </div>
        <p className="font-display font-bold text-lg">Vente enregistrée</p>
      </div>

      {/* Aperçu du ticket */}
      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-6px_rgba(19,26,44,0.15)] p-5 font-mono-num text-sm">
        <div className="text-center mb-3">
          <p className="font-display font-bold text-base">{shopName}</p>
          <p className="text-[var(--color-ink-faint)] text-xs">{address}</p>
          <p className="text-[var(--color-ink-faint)] text-xs mt-1">
            {new Date(order.created_at).toLocaleString('fr-FR')}
          </p>
        </div>
        <div className="border-t border-dashed border-[var(--color-border)] my-3" />
        <div className="flex flex-col gap-1.5">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-2">
              <span className="text-[var(--color-ink-soft)]">
                {item.quantity} x {item.product_name}
              </span>
              <span>{formatFCFA(item.unit_price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-dashed border-[var(--color-border)] my-3" />
        <div className="flex justify-between font-bold text-base">
          <span>TOTAL</span>
          <span>{formatFCFA(order.total)}</span>
        </div>
        <p className="text-xs text-[var(--color-ink-faint)] mt-2">
          {order.payment_mode === 'cash'
            ? 'Paiement comptant'
            : `Paiement à crédit — ${order.customer_name}`}
        </p>
        {footer && (
          <p className="text-center text-xs text-[var(--color-ink-faint)] mt-3 pt-3 border-t border-dashed border-[var(--color-border)]">
            {footer}
          </p>
        )}
      </div>

      {/* Boutons d'impression */}
      <div className="flex flex-col gap-2.5">
        {/* Impression système — universel */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          icon={<Printer size={18} />}
          onClick={onPrintWindow}
          disabled={isPrintingWindow}
        >
          {isPrintingWindow ? 'Ouverture…' : 'Imprimer (USB / Réseau)'}
        </Button>

        {/* Impression Bluetooth — Chrome/Edge uniquement */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          icon={<Bluetooth size={18} />}
          onClick={onPrintBluetooth}
          disabled={isPrintingBluetooth || !isBluetoothSupported}
          title={
            !isBluetoothSupported
              ? 'Web Bluetooth non disponible — utilisez Chrome ou Edge'
              : undefined
          }
        >
          {isPrintingBluetooth
            ? 'Impression…'
            : !isBluetoothSupported
              ? 'Bluetooth (non disponible)'
              : 'Imprimer (Bluetooth)'}
        </Button>

        <Button size="lg" fullWidth onClick={onDone}>
          Nouvelle vente
        </Button>
      </div>
    </div>
  );
}
