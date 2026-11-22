import { router } from 'expo-router';
import { CadastroScreen } from '@features/cadastro';

export default function CadastroRoute() {
  return (
    <CadastroScreen
      onGoToLogin={() =>
        router.canGoBack() ? router.back() : router.replace('/login')
      }
      onSuccess={() => router.replace('/dashboard')}
    />
  );
}