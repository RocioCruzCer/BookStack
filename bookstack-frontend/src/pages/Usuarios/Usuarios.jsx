import { useState, useEffect } from 'react';
import styles from './Page.module.css';

// TODO: Reemplaza esta URL por la de tu API Gateway
const API_URL = '/api/v1/users';

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    password: '',
    rol: 'ROLE_USER'
  });

  // Función para obtener el token del almacenamiento local
  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  // Cargar usuarios al entrar a la pantalla
  useEffect(() => {
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(API_URL, { headers: getAuthHeaders() });
      if (response.ok) {
        const data = await response.json();
        setUsuarios(data);
      } else {
        console.error('Error al cargar usuarios');
      }
    } catch (error) {
      console.error('Error de conexión:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Si estamos editando y dejaron la contraseña en blanco, la eliminamos del objeto para no sobreescribirla
    const dataToSend = { ...formData };
    if (editandoId && !dataToSend.password) {
      delete dataToSend.password;
    }

    try {
      const method = editandoId ? 'PUT' : 'POST';
      const url = editandoId ? `${API_URL}/${editandoId}` : API_URL;

      const response = await fetch(url, {
        method: method,
        headers: getAuthHeaders(),
        body: JSON.stringify(dataToSend)
      });

      if (response.ok) {
        cancelarEdicion();
        fetchUsuarios(); // Recargamos la tabla
      } else {
        alert('Error al guardar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (user) => {
    setEditandoId(user.id);
    setFormData({
      nombre: user.nombre,
      username: user.username,
      password: '', // Se deja vacío por seguridad
      rol: user.rol
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchUsuarios();
      } else {
        alert('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const cancelarEdicion = () => {
    setEditandoId(null);
    setFormData({ nombre: '', username: '', password: '', rol: 'ROLE_USER' });
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>Gestión de Usuarios</h1>

      <div className={styles.card}>
        <h3 style={{ marginTop: 0, color: 'var(--color-borgona)', fontFamily: 'var(--font-titulos)' }}>
          {editandoId ? 'Editar Usuario' : 'Registrar Nuevo Usuario'}
        </h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Nombre Completo:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Username:</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} required className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Contraseña:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required={!editandoId} placeholder={editandoId ? 'Dejar en blanco para no cambiar' : ''} className={styles.input} />
          </div>
          <div className={styles.formGroup}>
            <label>Rol:</label>
            <select name="rol" value={formData.rol} onChange={handleChange} className={styles.select}>
              <option value="ROLE_USER">Lector</option>
              <option value="ROLE_ADMIN">Administrador</option>
            </select>
          </div>
          <div className={styles.btnGroup}>
            <button type="submit" className={styles.btnPrimary}>{editandoId ? 'Guardar Cambios' : 'Registrar'}</button>
            {editandoId && <button type="button" onClick={cancelarEdicion} className={styles.btnDanger}>Cancelar</button>}
          </div>
        </form>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Nombre</th><th>Username</th><th>Rol</th><th style={{textAlign:'center'}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user.id}>
                <td><strong>{user.nombre}</strong></td>
                <td>@{user.username}</td>
                <td>
                  <span className={user.rol === 'ROLE_ADMIN' ? styles.badgeAdmin : styles.badgeUser}>
                    {user.rol === 'ROLE_ADMIN' ? 'Admin' : 'Lector'}
                  </span>
                </td>
                <td style={{textAlign:'center'}}>
                  <button onClick={() => handleEdit(user)} style={{ marginRight: '10px', padding: '6px 12px', cursor: 'pointer', border: '1px solid var(--color-oro-viejo)', background: 'transparent', color: 'var(--color-cafe)', borderRadius: '4px' }}>Editar</button>
                  <button onClick={() => handleDelete(user.id)} style={{ padding: '6px 12px', cursor: 'pointer', border: 'none', background: '#a94442', color: 'white', borderRadius: '4px' }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}