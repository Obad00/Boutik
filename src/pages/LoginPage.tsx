import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Store, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../store/authStore';
import { AVAILABLE_DEMO_CODES } from '../services/client';

export function LoginPage() {
  const [code, setCode] = useState('');
  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);
  const error = useAuthStore((s) => s.error);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(code);
    if (ok) navigate('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-primary)] px-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-3xl bg-white/10 flex items-center justify-center mb-5">
            <Store size={28} className="text-white" />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-white">Boutik</h1>
          <p className="text-white/60 mt-2 text-sm">La caisse et la gestion de votre boutique, simplement.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-[var(--radius-card-lg)] p-6 shadow-2xl flex flex-col gap-4">
          <Input
            label="Code boutique"
            placeholder="Ex: SANDAGA"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            autoCapitalize="characters"
            autoFocus
          />
          {error && <p className="text-sm text-[var(--color-cash-out)] -mt-2">{error}</p>}
          <Button type="submit" size="lg" fullWidth disabled={isLoading || !code.trim()} icon={<ArrowRight size={18} />}>
            {isLoading ? 'Connexion…' : 'Se connecter'}
          </Button>
          <p className="text-xs text-[var(--color-ink-faint)] text-center">
            Démo : essayez le code <span className="font-mono-num font-semibold">{AVAILABLE_DEMO_CODES[0]}</span> ou{' '}
            <span className="font-mono-num font-semibold">{AVAILABLE_DEMO_CODES[1]}</span>
          </p>
        </form>

        <Link to="/superadmin" className="block text-center text-xs text-white/40 mt-5">
          Espace superadmin
        </Link>
      </div>
    </div>
  );
}
