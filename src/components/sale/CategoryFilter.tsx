import type { Category } from '../../types';

interface Props {
  categories: Category[];
  selected: string | null;
  onSelect: (id: string | null) => void;
}

// Fondu aux bords : affordance visuelle que la rangée de pills scrolle
// horizontalement (utile dès que les catégories dépassent la largeur
// disponible, notamment entre 768-1023px où le panier fixe/sidebar ne
// laissent plus autant de place). -webkit-mask-image explicite car iPad
// Safari est la cible principale de cet écran.
const edgeFadeStyle = {
  WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
  maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 16px), transparent)',
};

export function CategoryFilter({ categories, selected, onSelect }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
      style={edgeFadeStyle}
    >
      <button
        onClick={() => onSelect(null)}
        className={`tap-scale shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${
          selected === null ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'
        }`}
      >
        Tout
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={`tap-scale shrink-0 px-4 py-2 rounded-full text-sm font-semibold ${
            selected === cat.id ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-surface)] text-[var(--color-ink-soft)]'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
