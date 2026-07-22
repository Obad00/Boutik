import { useEffect } from 'react';
import { AppRouter } from './router';
import { useAuthStore } from './store/authStore';

function App() {
  const init = useAuthStore((s) => s.init);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // Un 401 sur un appel boutique (token expiré/révoqué) doit faire
    // retomber l'app en état déconnecté plutôt que de rester bloquée sur
    // des requêtes qui échouent en boucle — voir http.ts.
    const onUnauthorized = () => logout();
    window.addEventListener('boutik:shop-unauthorized', onUnauthorized);
    return () => window.removeEventListener('boutik:shop-unauthorized', onUnauthorized);
  }, [logout]);

  return <AppRouter />;
}

export default App;
