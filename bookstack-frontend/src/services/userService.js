// src/services/userService.js

const API_URL = '/api/v1/users';

// Función auxiliar para obtener los headers con el token
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const obtenerUsuarios = async () => {
  const response = await fetch(API_URL, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al cargar los usuarios');
  return response.json();
};

export const crearUsuario = async (usuario) => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(usuario)
  });
  if (!response.ok) throw new Error('Error al crear el usuario');
  return response.json();
};

export const actualizarUsuario = async (id, usuario) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(usuario)
  });
  if (!response.ok) throw new Error('Error al actualizar el usuario');
  return response.json();
};

export const eliminarUsuario = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });
  if (!response.ok) throw new Error('Error al eliminar el usuario');
  // Muchos endpoints DELETE devuelven 204 No Content, por lo que no siempre hay un JSON de respuesta.
  return true;
};