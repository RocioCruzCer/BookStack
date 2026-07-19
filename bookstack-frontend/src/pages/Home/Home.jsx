import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { obtenerUsuarios } from '../../services/userService'; // Usamos tu servicio conectado al ApiGateway
import styles from './Home.module.css';

export default function Home() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(true);
  const [mostrarModalLogout, setMostrarModalLogout] = useState(false);

  // Estado para guardar la información real del perfil obtenida de la API
  const [datosUsuario, setDatosUsuario] = useState({ nombre: 'Cargando...', username: '', rol: '' });

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const cargarPerfilDesdeAPI = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        // 1. Extraemos el username del token para saber quién preguntar
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));
        const miUsername = payloadDecodificado.sub;

        // Establecemos rápido el rol inicial por si se requiere bloquear rutas rápido
        const adminCheck = JSON.stringify(payloadDecodificado).includes('ROLE_ADMIN');
        setEsAdmin(adminCheck);

        // 2. Consumimos el ApiGateway mediante tu servicio de usuarios
        const todosLosUsuarios = await obtenerUsuarios();
        const usuarioEncontrado = todosLosUsuarios.find(u => u.username === miUsername);

        if (usuarioEncontrado) {
          setDatosUsuario({
            nombre: usuarioEncontrado.nombre,
            username: usuarioEncontrado.username,
            rol: usuarioEncontrado.rol === 'ROLE_ADMIN' ? 'Administrador' : 'Lector'
          });
        } else {
          // Si por alguna razón no lo halla, usamos una respuesta fallback con lo que tiene el token
          setDatosUsuario({
            nombre: payloadDecodificado.nombre || 'Usuario',
            username: miUsername,
            rol: adminCheck ? 'Administrador' : 'Lector'
          });
        }
      } catch (error) {
        console.error("Error cargando perfil en sidebar:", error);
        // Evitamos sacar al usuario inmediatamente por fallos de red menores, dejando datos por defecto
        setDatosUsuario({ nombre: 'Usuario Temporal', username: '', rol: esAdmin ? 'Administrador' : 'Lector' });
      }
    };

    cargarPerfilDesdeAPI();
  }, [navigate]);

  const ejecutarCierreSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const menuAdmin = [
    { nombre: 'Dashboard', ruta: '/home' },
    { nombre: 'Catálogo de Libros', ruta: '/home/catalogo' },
    { nombre: 'Gestión de Préstamos', ruta: '/home/prestamos' },
    { nombre: 'Gestión de Usuarios', ruta: '/home/usuarios' }
  ];

  const menuLector = [
    { nombre: 'Dashboard', ruta: '/home' },
    { nombre: 'Catálogo y Búsqueda', ruta: '/home/catalogo' },
    { nombre: 'Mis Préstamos', ruta: '/home/mis-prestamos' }
  ];

  const menuItems = esAdmin ? menuAdmin : menuLector;

  return (
    <div className={styles.layout}>

      {/* Menú Lateral (Sidebar) - Ahora es más ancho */}
      {menuAbierto && (
        <div className={styles.sidebar}>

          {/* Tarjeta de Perfil Conectada a la API */}
          <div className={styles.sidebarProfile}>
            <div className={styles.profileAvatar}>
              {datosUsuario.nombre.charAt(0)}
            </div>
            <h4 className={styles.profileName}>
              {datosUsuario.nombre}
            </h4>
            <p className={styles.profileUsername}>
              @{datosUsuario.username || 'username'}
            </p>
            <span className={datosUsuario.rol === 'Administrador' ? styles.profileBadgeAdmin : styles.profileBadgeUser}>
              {datosUsuario.rol}
            </span>
          </div>

          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const activo = location.pathname === item.ruta;
              return (
                <li
                  key={item.nombre}
                  onClick={() => navigate(item.ruta)}
                  className={`${styles.menuItem} ${activo ? styles.menuItemActive : ''}`}
                >
                  {item.nombre}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Contenedor Derecho (Navbar + Contenido dinámico) */}
      <div className={styles.mainContent}>

        {/* Navbar Superior */}
        <div className={styles.topbar}>
          <div className={styles.brandGroup}>
            <button onClick={() => setMenuAbierto(!menuAbierto)} className={styles.menuToggle}>☰</button>
            <h2 className={styles.brandTitle}>BOOKSTACK</h2>
          </div>
          <button onClick={() => setMostrarModalLogout(true)} className={styles.logoutBtn}>Cerrar Sesión</button>
        </div>

        {/* Área de Trabajo Principal */}
        <div className={styles.workspace}>
          <Outlet />
        </div>

      </div>

      {/* Modal de Confirmación de Cierre de Sesión */}
      {mostrarModalLogout && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <h3 className={styles.modalTitle}>Cerrar Sesión</h3>
            <p className={styles.modalText}>¿Estás seguro de que deseas salir del sistema?</p>

            <div className={styles.modalActions}>
              <button onClick={() => setMostrarModalLogout(false)} className={styles.btnCancel}>Cancelar</button>
              <button onClick={ejecutarCierreSesion} className={styles.btnConfirm}>Sí, salir</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}