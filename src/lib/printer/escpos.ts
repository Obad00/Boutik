// Generateur de commandes ESC/POS pour imprimante thermique 58mm.
import type { Order } from '../../types';

const ESC = 0x1b;
const GS  = 0x1d;

/** Formatage monetaire avec espace simple ASCII (pas d'insecables). */
function formatAmount(amount: number): string {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}

class EscPosBuilder {
  private bytes: number[] = [];

  init(): this {
    this.bytes.push(ESC, 0x40);
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
    // Encode en Latin-1 (ISO-8859-1) — standard pour les imprimantes thermiques
    // Les caracteres hors Latin-1 sont remplaces par '?' pour eviter les artefacts
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      this.bytes.push(code <= 0xff ? code : 0x3f); // 0x3f = '?'
    }
    return this;
  }

  line(str = ''): this {
    this.text(str);
    this.bytes.push(0x0a);
    return this;
  }

  divider(width = 32): this {
    this.line('-'.repeat(width));
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

export function buildReceiptBytes(
  order: Order,
  shopName: string,
  address: string,
  footer?: string,
): Uint8Array {
  const b = new EscPosBuilder().init();

  // En-tete
  b.align('center').bold(true).doubleSize(true).line(shopName);
  b.doubleSize(false).bold(false);
  b.line(address);
  b.line(new Date(order.created_at).toLocaleString('fr-FR'));
  b.divider();

  // Articles
  b.align('left');
  for (const item of order.items) {
    b.line(`${item.quantity} x ${item.product_name}`);
    b.align('right').line(formatAmount(item.unit_price * item.quantity));
    b.align('left');
  }
  b.divider();

  // Total
  b.align('right').bold(true).line(`TOTAL: ${formatAmount(order.total)}`).bold(false);
  b.align('left');

  // Mode de paiement
  b.line(
    order.payment_mode === 'cash'
      ? 'Paiement: Comptant'
      : `Paiement: Credit (${order.customer_name ?? ''})`,
  );

  // Footer optionnel
  if (footer) {
    b.divider();
    b.align('center').line(footer);
  }

  b.feed(3).cut();
  return b.build();
}
