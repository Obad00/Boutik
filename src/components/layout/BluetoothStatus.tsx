import { Bluetooth, BluetoothConnected, Loader2 } from 'lucide-react';
import { usePrinterStore, printerSupported } from '../../store/printerStore';

export function BluetoothStatus({ variant = 'light', compact = false }: { variant?: 'light' | 'dark'; compact?: boolean }) {
  const isConnected = usePrinterStore((s) => s.isConnected);
  const isConnecting = usePrinterStore((s) => s.isConnecting);
  const deviceName = usePrinterStore((s) => s.deviceName);
  const connect = usePrinterStore((s) => s.connect);
  const disconnect = usePrinterStore((s) => s.disconnect);

  if (!printerSupported) return null;

  const dark = variant === 'dark';

  function handleClick() {
    if (isConnected) {
      disconnect();
    } else if (!isConnecting) {
      connect();
    }
  }

  return (
    <button
      onClick={handleClick}
      className={`tap-scale flex items-center gap-2 rounded-xl font-semibold ${compact ? 'p-2.5 text-xs' : 'px-3 py-2 text-xs'} ${
        isConnected
          ? 'bg-[var(--color-cash-in-soft)] text-[var(--color-cash-in)]'
          : dark
            ? 'bg-white/10 text-white/60'
            : 'bg-black/[0.04] text-[var(--color-ink-faint)]'
      }`}
      title={isConnected ? `Imprimante connectée — ${deviceName}` : 'Connecter une imprimante Bluetooth'}
    >
      {isConnecting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : isConnected ? (
        <BluetoothConnected size={14} />
      ) : (
        <Bluetooth size={14} />
      )}
      {!compact && (
        <span className="truncate max-w-[7rem]">
          {isConnecting ? 'Connexion…' : isConnected ? deviceName ?? 'Imprimante' : 'Imprimante'}
        </span>
      )}
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${isConnected ? 'bg-[var(--color-cash-in)]' : 'bg-[var(--color-ink-faint)]/50'}`} />
    </button>
  );
}
