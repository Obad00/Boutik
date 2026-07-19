import { create } from 'zustand';
import type { Order, ShopSettings } from '../types';
import { buildReceiptBytes } from '../lib/printer/escpos';
import {
  connectPrinter,
  sendToPrinter,
  disconnectPrinter,
  isBluetoothSupported,
  type PrinterConnection,
} from '../lib/printer/bluetooth';
import { printReceiptWindow } from '../lib/printer/printWindow';

interface PrinterState {
  // --- Bluetooth ---
  connection: PrinterConnection | null;
  isConnected: boolean;
  isConnecting: boolean;
  /** Vrai pendant une impression Bluetooth en cours. */
  isPrinting: boolean;
  deviceName: string | null;
  error: string | null;
  connect: () => Promise<boolean>;
  disconnect: () => void;
  /** Impression ESC/POS via Web Bluetooth (imprimante sans-fil BLE). */
  printBluetooth: (order: Order, shopName: string, address: string, footer?: string) => Promise<boolean>;

  // --- Impression systeme (window.print) ---
  /** Vrai entre le clic et la fin de l'impression systeme. */
  isPrintingWindow: boolean;
  /** Impression via la boite de dialogue systeme (USB, reseau, AirPrint). Universelle. */
  printWindow: (order: Order, settings: ShopSettings) => Promise<void>;
}

export const usePrinterStore = create<PrinterState>((set, get) => ({
  // Bluetooth
  connection: null,
  isConnected: false,
  isConnecting: false,
  isPrinting: false,
  deviceName: null,
  error: null,

  // Impression systeme
  isPrintingWindow: false,

  connect: async () => {
    set({ isConnecting: true, error: null });
    try {
      const conn = await connectPrinter();
      conn.device.addEventListener('gattserverdisconnected', () => {
        set({ isConnected: false, connection: null, deviceName: null });
      });
      set({
        connection: conn,
        isConnected: true,
        isConnecting: false,
        deviceName: conn.device.name ?? 'Imprimante',
      });
      return true;
    } catch (e) {
      set({
        isConnecting: false,
        isConnected: false,
        error: e instanceof Error ? e.message : "Connexion a l'imprimante echouee",
      });
      return false;
    }
  },

  disconnect: () => {
    const conn = get().connection;
    if (conn) disconnectPrinter(conn);
    set({ connection: null, isConnected: false, deviceName: null });
  },

  printBluetooth: async (order, shopName, address, footer) => {
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
      set({ error: e instanceof Error ? e.message : "Echec de l'impression Bluetooth" });
      return false;
    } finally {
      set({ isPrinting: false });
    }
  },

  printWindow: async (order, settings) => {
    // Eviter un double-clic pendant l'impression
    if (get().isPrintingWindow) return;
    set({ isPrintingWindow: true, error: null });
    try {
      await printReceiptWindow(
        order,
        settings.shop_name,
        settings.address,
        settings.phone,
        settings.receipt_footer,
      );
    } catch (e) {
      set({ error: e instanceof Error ? e.message : "Echec de l'impression systeme" });
    } finally {
      // isPrintingWindow repasse a false seulement apres la fin de la Promise
      // (afterprint ou timeout 30s) — le bouton reste desactive pendant toute l'impression
      set({ isPrintingWindow: false });
    }
  },
}));

export const printerSupported = isBluetoothSupported();
