// src/services/authService.js
const API_URL = 'http://localhost:8081/api/v1';

export const login = async (credenciales) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciales)
  });

  if (!response.ok) {
    throw new Error('Usuario o contraseña incorrectos');
  }
  return response.json();
};

export const register = async (usuario) => {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(usuario)
  });

  if (!response.ok) {
    throw new Error('Error al registrar el usuario');
  }
  return response.json();
};