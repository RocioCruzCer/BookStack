import { useState, useEffect } from 'react';
import { obtenerUsuarios } from '../../services/userService'; // Asegúrate de que la ruta sea correcta
import styles from './Page.module.css'; // Mantenemos tu archivo de estilos

export default function MiPerfil() {
  const [miUsuario, setMiUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarMiPerfil = async () => {
      try {
        // 1. Rescatamos el token del navegador
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No hay sesión iniciada');

        // 2. Decodificamos el token para saber quién soy
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));
        const miUsername = payloadDecodificado.sub;

        // 3. Traemos todos los usuarios usando tu servicio
        const todosLosUsuarios = await obtenerUsuarios();

        // 4. Buscamos el que coincida con mi username
        const usuarioEncontrado = todosLosUsuarios.find(u => u.username === miUsername);

        if (!usuarioEncontrado) {
          throw new Error('No se encontraron los datos de tu perfil en la base de datos');
        }

        // 5. Lo guardamos en el estado para pintarlo
        setMiUsuario(usuarioEncontrado);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    cargarMiPerfil();
  }, []);

  if (cargando) return <h2 style={{ padding: '20px' }}>Cargando tu perfil...</h2>;
  if (error) return <h2 style={{ padding: '20px', color: '#a94442' }}>Error: {error}</h2>;

  return (
    <div>
      <h1 className={styles.pageTitle}>Mi Perfil</h1>

      {miUsuario && (
        <div className={styles.card} style={{ maxWidth: '500px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center' }}>
            <div className={styles.profileAvatar}>
              {miUsuario.nombre.charAt(0)}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '1.1em', marginTop: '20px' }}>
            <p style={{ margin: 0, borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
              <span style={{ color: '#888', fontSize: '0.9em', display: 'block' }}>Nombre Completo</span>
              <strong>{miUsuario.nombre}</strong>
            </p>

            <p style={{ margin: 0, borderBottom: '1px solid #eaeaea', paddingBottom: '10px' }}>
              <span style={{ color: '#888', fontSize: '0.9em', display: 'block' }}>Nombre de Usuario (Username)</span>
              <strong>@{miUsuario.username}</strong>
            </p>

            <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span style={{ color: '#888', fontSize: '0.9em' }}>Nivel de Acceso: </span>
              <span className={miUsuario.rol === 'ROLE_ADMIN' ? styles.badgeAdmin : styles.badgeUser}>
                {miUsuario.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Lector'}
              </span>
            </p>
          </div>

        </div>
      )}
    </div>
  );
}