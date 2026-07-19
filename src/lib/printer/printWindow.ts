// Impression via window.print() — compatible tous navigateurs et TPE/POS Android.
//
// Technique : injection d'un div#boutik-print-area dans le body, @media print masque
// tout le reste, window.print() est appele, puis le div est nettoye.
//
// Retourne une Promise qui se resout apres l'impression (ou timeout 30s sur TPE
// qui ne supportent pas l'evenement afterprint).

import type { Order } from '../../types';

const PRINT_AREA_ID = 'boutik-print-area';

/** Separateur de milliers ASCII — evite les espaces insecables de toLocaleString. */
function formatAmount(amount: number): string {
  return Math.round(amount).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildReceiptHtml(
  order: Order,
  shopName: string,
  address: string,
  phone: string,
  footer?: string,
): string {
  const date = new Date(order.created_at).toLocaleString('fr-FR');
  const paymentLabel =
    order.payment_mode === 'cash'
      ? 'Paiement: Comptant'
      : `Paiement: Credit - ${escapeHtml(order.customer_name ?? '')}`;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<tr>
          <td class="bpa-item-name">${item.quantity} x ${escapeHtml(item.product_name)}</td>
          <td class="bpa-item-price">${formatAmount(item.unit_price * item.quantity)}</td>
        </tr>`,
    )
    .join('');

  return `
    <p class="bpa-shop-name">${escapeHtml(shopName)}</p>
    <p class="bpa-shop-info">${escapeHtml(address)}</p>
    ${phone ? `<p class="bpa-shop-info">${escapeHtml(phone)}</p>` : ''}
    <p class="bpa-shop-info">${date}</p>
    <hr class="bpa-divider" />
    <table class="bpa-table">
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr class="bpa-total-row">
          <td>TOTAL</td>
          <td class="bpa-right">${formatAmount(order.total)}</td>
        </tr>
      </tfoot>
    </table>
    <hr class="bpa-divider" />
    <p class="bpa-payment-label">${paymentLabel}</p>
    ${footer ? `<hr class="bpa-divider" /><p class="bpa-footer-text">${escapeHtml(footer)}</p>` : ''}
  `;
}

/**
 * Lance l'impression du ticket via la boite de dialogue systeme.
 * Retourne une Promise qui se resout quand l'impression est terminee
 * (ou apres un timeout de 30s pour les TPE/POS qui ne supportent pas afterprint).
 */
export function printReceiptWindow(
  order: Order,
  shopName: string,
  address: string,
  phone: string,
  footer?: string,
): Promise<void> {
  return new Promise((resolve) => {
    // Nettoyer un eventuel div residuel
    document.getElementById(PRINT_AREA_ID)?.remove();

    const div = document.createElement('div');
    div.id = PRINT_AREA_ID;
    div.innerHTML = buildReceiptHtml(order, shopName, address, phone, footer);
    document.body.appendChild(div);

    const cleanup = () => {
      document.getElementById(PRINT_AREA_ID)?.remove();
      window.removeEventListener('afterprint', onAfterPrint);
      clearTimeout(fallbackTimer);
      resolve();
    };

    const onAfterPrint = () => cleanup();

    // Timeout de securite : 30s max (TPE lents ou afterprint non supporte)
    const fallbackTimer = setTimeout(cleanup, 30_000);

    window.addEventListener('afterprint', onAfterPrint, { once: true });

    // Petit delai pour laisser le DOM se mettre a jour avant d'imprimer
    setTimeout(() => {
      window.print();
    }, 50);
  });
}
