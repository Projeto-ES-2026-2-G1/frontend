// Sessão provisória, equivalente ao `sessionStorage('logado')` do site original.
// TODO: quando a API de autenticação existir, trocar por um token real,
// persistido (SecureStore) e validado pelo backend em todas as telas.

let authenticated = false;

/**
 * Marks the current session as active (site's `sessionStorage.setItem('logado', '1')`).
 */
export function logIn(): void {
  authenticated = true;
}

/**
 * Ends the current session (site's `sessionStorage.removeItem('logado')`).
 */
export function logOut(): void {
  authenticated = false;
}

/**
 * Indicates whether there is an active session (site's `sessionStorage.getItem('logado') === '1'`).
 */
export function isLoggedIn(): boolean {
  return authenticated;
}
