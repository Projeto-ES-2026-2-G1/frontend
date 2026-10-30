/** Handle comum dos cards de login/cadastro: foca o primeiro campo. */
export interface AuthCardHandle {
  focusFirstField(): void;
}

/** Card atualmente visível na tela de login. */
export type AuthCardActive = 'login' | 'cadastro';
