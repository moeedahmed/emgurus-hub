import { AuthProvider } from '@/core/auth/AuthProvider';
import { AppRouter } from '@/app/Router';

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
