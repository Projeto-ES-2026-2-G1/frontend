import { RegisterData, RegisterResponse } from '../types/registerTypes';

// Substituir pela URL base correta da API do seu backend ou use variáveis de ambiente
const API_URL = 'http://localhost:3300'; 

export async function registerUser(data: RegisterData): Promise<RegisterResponse> {
  const response = await fetch(`${API_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro ao registrar usuário.');
  }

  const result: RegisterResponse = await response.json();
  return result; // Aqui vem o token!
}