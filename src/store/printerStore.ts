import { create } from 'zustand';
import type { Order } from '../types';
import { buildReceiptBytes } from '../lib/printer/escpos';
import { connectPrinter, sendToPrinter, disconnectPrinter, isBluetoothSupported, type PrinterConnection } from '../lib/printer/bluetooth';

interface PrinterState {
  connection: PrinterConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  isPrinting: boolean;
  deviceName: string | null;
  error: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  print: (order: Order, shopName: string, address: string, footer?: string) => Promise<boolean>;
}

export const usePrinterStore = create<PrinterState>((set, get) => ({
  connection: null,
  isConnected: false,
  isConnecting: false,
  isPrinting: false,
  deviceName: null,
  error: null,

  connect: async () => {
    set({ isConnecting: true, error: null });
    try {
      const conn = await connectPrinter();
      conn.device.addEventListener('gattserverdisconnected', () => {
        set({ isConnected: false, connection: null, deviceName: null });
      });
      set({ connection: conn, isConnected: true, isConnecting: false, deviceName: conn.device.name ?? 'Imprimante' });
      return true;
    } catch (e) {
      set({
        isConnecting: false,
        isConnected: false,
        error: e instanceof Error ? e.message : "Connexion à l'imprimante échouée",
      });
      return false;
    }
  },

  disconnect: () => {
    const conn = get().connection;
    if (conn) disconnectPrinter(conn);
    set({ connection: null, isConnected: false, deviceName: null });
  },

  print: async (order, shopName, address, footer) => {
    set({ error: null, isPrinting: true });
    try {
      let conn = get().connection;
      if (!conn) {
        const ok = await get().connect();
        if (!ok) return false;
        conn = get().connection;
      }
      const bytes = buildReceiptBytes(order, shopName, address, footer);
      await sendToPrinter(conn!, bytes);
      return true;
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Échec de l'impression" });
      return false;
    } finally {
      set({ isPrinting: false });
    }
  },
}));

export const printerSupported = isBluetoothSupported();
