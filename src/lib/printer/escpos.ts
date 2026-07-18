// Générateur de commandes ESC/POS pour imprimante ticket 58mm.
import type { Order } from '../../types';
import { formatFCFA } from '../currency';

const ESC = 0x1b;
const GS = 0x1d;

class EscPosBuilder {
  private bytes: number[] = [];

  init(): this {
    this.bytes.push(ESC, 0x40); // initialise l'imprimante
    return this;
  }

  align(mode: 'left' | 'center' | 'right'): this {
    const n = mode === 'left' ? 0 : mode === 'center' ? 1 : 2;
    this.bytes.push(ESC, 0x61, n);
    return this;
  }

  bold(on: boolean): this {
    this.bytes.push(ESC, 0x45, on ? 1 : 0);
    return this;
  }

  doubleSize(on: boolean): this {
    this.bytes.push(GS, 0x21, on ? 0x11 : 0x00);
    return this;
  }

  text(str: string): this {
    const encoded = new TextEncoder().encode(str);
    this.bytes.push(...Array.from(encoded));
    return this;
  }

  line(str = ''): this {
    this.text(str);
    this.bytes.push(0x0a);
    return this;
  }

  divider(): this {
    this.line('--------------------------------');
    return this;
  }

  feed(lines = 3): this {
    this.bytes.push(ESC, 0x64, lines);
    return this;
  }

  cut(): this {
    this.bytes.push(GS, 0x56, 0x00);
    return this;
  }

  build(): Uint8Array {
    return new Uint8Array(this.bytes);
  }
}

export function buildReceiptBytes(order: Order, shopName: string, address: string, footer?: string): Uint8Array {
  const b = new EscPosBuilder().init();
  b.align('center').bold(true).doubleSize(true).line(shopName);
  b.doubleSize(false).bold(false);
  b.line(address);
  b.line(new Date(order.created_at).toLocaleString('fr-FR'));
  b.divider();
  b.align('left');
  for (const item of order.items) {
    b.line(`${item.quantity} x ${item.product_name}`);
    b.align('right').line(formatFCFA(item.unit_price * item.quantity));
    b.align('left');
  }
  b.divider();
  b.align('right').bold(true).line(`TOTAL: ${formatFCFA(order.total)}`).bold(false);
  b.align('left');
  b.line(order.payment_mode === 'cash' ? 'Paiement: Comptant' : `Paiement: Crédit (${order.customer_name ?? ''})`);
  if (footer) {
    b.divider();
    b.align('center').line(footer);
  }
  b.feed(3);
  b.cut();
  return b.build();
}
