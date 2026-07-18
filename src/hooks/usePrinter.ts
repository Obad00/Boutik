// Fine wrapper autour du store global d'imprimante (état partagé dans toute l'app,
// pour que l'indicateur de connexion reste visible quel que soit l'écran).
import { usePrinterStore, printerSupported } from '../store/printerStore';

export function usePrinter() {
  const isConnected = usePrinterStore((s) => s.isConnected);
  const isPrinting = usePrinterStore((s) => s.isPrinting);
  const error = usePrinterStore((s) => s.error);
  const connect = usePrinterStore((s) => s.connect);
  const print = usePrinterStore((s) => s.print);

  return {
    isSupported: printerSupported,
    isConnected,
    isPrinting,
    error,
    connect,
    print,
  };
}
