import { Redirect } from 'expo-router';

export default function IndexRoute() {
  // A entrada do app é a tela de login, como no site original.
  return <Redirect href="/login" />;
}
