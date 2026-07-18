export function formatFCFA(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString('fr-FR')} FCFA`;
}

export function formatFCFACompact(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toLocaleString('fr-FR');
}
