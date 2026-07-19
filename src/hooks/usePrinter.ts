// Wrapper autour du store global d'imprimante.
// Expose les deux methodes d'impression :
//   - printBluetooth : ESC/POS via Web Bluetooth (BLE, Chrome/Edge uniquement)
//   - printWindow    : boite de dialogue systeme via window.print() (universel)
import { usePrinterStore, printerSupported } from '../store/printerStore';

export function usePrinter() {
  const isConnected      = usePrinterStore((s) => s.isConnected);
  const isPrinting       = usePrinterStore((s) => s.isPrinting);
  const isPrintingWindow = usePrinterStore((s) => s.isPrintingWindow);
  const error            = usePrinterStore((s) => s.error);
  const connect          = usePrinterStore((s) => s.connect);
  const printBluetooth   = usePrinterStore((s) => s.printBluetooth);
  const printWindow      = usePrinterStore((s) => s.printWindow);

  return {
    /** Web Bluetooth disponible (Chrome/Edge uniquement). */
    isBluetoothSupported: printerSupported,
    isConnected,
    /** Vrai pendant une impression Bluetooth en cours. */
    isPrinting,
    /** Vrai entre le clic et la fin de l'impression systeme (ou timeout 30s). */
    isPrintingWindow,
    error,
    connect,
    /** Impression ESC/POS via Web Bluetooth. */
    printBluetooth,
    /** Impression via la boite de dialogue systeme. Universelle. */
    printWindow,
  };
}
