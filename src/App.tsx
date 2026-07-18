import { useEffect } from 'react';
import { AppRouter } from './router';
import { useAuthStore } from './store/authStore';

function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return <AppRouter />;
}

export default App;
