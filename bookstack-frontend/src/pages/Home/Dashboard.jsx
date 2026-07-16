import { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [nombreUsuario, setNombreUsuario] = useState('Usuario');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificamos el token real guardado del ApiGateway
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));

        // Comprobamos el rol
        const adminCheck = JSON.stringify(payloadDecodificado).includes('ROLE_ADMIN');
        setEsAdmin(adminCheck);

        // Guardamos el nombre real para personalizar el saludo
        if (payloadDecodificado.nombre) {
          setNombreUsuario(payloadDecodificado.nombre);
        }
      } catch (error) {
        console.error("Error al decodificar el token en el dashboard", error);
      }
    }
  }, []);

  // --- DATOS ESTÁTICOS PARA ADMINISTRADOR ---
  const statsAdmin = {
    totalLibros: 156,
    usuariosActivos: 32,
    prestamosPendientes: 12
  };

  const actividadGlobal = [
    { id: 1, usuario: "@juan.perez", accion: "Préstamo", detalle: "El Señor de los Anillos", fecha: "12 Jul 2026", estado: "Pendiente" },
    { id: 2, usuario: "@maria.gomez", accion: "Devolución", detalle: "Cien años de soledad", fecha: "11 Jul 2026", estado: "Completado" },
    { id: 3, usuario: "@admin.bookstack", accion: "Registro", detalle: "Nuevo libro: Hábitos Atómicos", fecha: "10 Jul 2026", estado: "Completado" },
    { id: 4, usuario: "@carlos.ruiz", accion: "Préstamo", detalle: "Don Quijote de la Mancha", fecha: "09 Jul 2026", estado: "Atrasado" }
  ];

  // --- DATOS ESTÁTICOS PARA LECTOR (USUARIO COMÚN) ---
  const statsLector = {
    misLibrosLeidos: 14,
    prestamosVigentes: 2,
    penalizaciones: 0
  };

  const misPrestamos = [
    { id: 1, usuario: "Tú", accion: "Préstamo", detalle: "El Señor de los Anillos", fecha: "12 Jul 2026", estado: "Pendiente" },
    { id: 2, usuario: "Tú", accion: "Devolución", detalle: "Hábitos Atómicos", fecha: "01 Jul 2026", estado: "Completado" }
  ];

  // Función para determinar el color de la etiqueta según el estado
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Completado': return `${styles.badge} ${styles.badgeCompletado}`;
      case 'Pendiente': return `${styles.badge} ${styles.badgePendiente}`;
      case 'Atrasado': return `${styles.badge} ${styles.badgeAtrasado}`;
      default: return styles.badge;
    }
  };

  return (
    <div>
      <h1 className={styles.pageTitle}>
        {esAdmin ? 'Panel de Administración' : `¡Hola, ${nombreUsuario}!`}
      </h1>
      <p className={styles.subtitle}>
        {esAdmin
          ? 'Bienvenido al sistema de control global de BookStack. Aquí tienes el estado de la biblioteca.'
          : 'Bienvenido a tu rincón de lectura personal. Este es el resumen de tus préstamos.'}
      </p>

      {/* =========================================
         TARJETAS DE RESUMEN (KPIs CONDICIONALES)
      ========================================= */}
      {esAdmin ? (
        /* VISTA DE RESUMEN PARA ADMIN */
        <div className={styles.kpiGrid}>
          <div className={`${styles.kpiCard} ${styles.borderOro}`}>
            <h3 className={styles.kpiLabel}>Total de Libros</h3>
            <p className={styles.kpiValue}>{statsAdmin.totalLibros}</p>
          </div>

          <div className={`${styles.kpiCard} ${styles.borderBorgona}`}>
            <h3 className={styles.kpiLabel}>Usuarios Registrados</h3>
            <p className={styles.kpiValue}>{statsAdmin.usuariosActivos}</p>
          </div>

          <div className={`${styles.kpiCard} ${styles.borderVerde}`}>
            <h3 className={styles.kpiLabel}>Préstamos Activos</h3>
            <p className={styles.kpiValue}>{statsAdmin.prestamosPendientes}</p>
          </div>
        </div>
      ) : (
        /* VISTA DE RESUMEN PARA LECTOR */
        <div className={styles.kpiGrid}>
          <div className={`${styles.kpiCard} ${styles.borderVerde}`}>
            <h3 className={styles.kpiLabel}>Mis Préstamos Activos</h3>
            <p className={styles.kpiValue}>{statsLector.prestamosVigentes}</p>
          </div>

          <div className={`${styles.kpiCard} ${styles.borderOro}`}>
            <h3 className={styles.kpiLabel}>Libros Leídos</h3>
            <p className={styles.kpiValue}>{statsLector.misLibrosLeidos}</p>
          </div>

          <div className={`${styles.kpiCard} ${styles.borderBorgona}`}>
            <h3 className={styles.kpiLabel}>Multas / Retrasos</h3>
            <p className={styles.kpiValue}>{statsLector.penalizaciones}</p>
          </div>
        </div>
      )}

      {/* =========================================
         TABLAS DINÁMICAS SEGÚN EL ROL
      ========================================= */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3 className={styles.sectionTitle}>
            {esAdmin ? 'Actividad Reciente del Sistema' : 'Historial de mis Préstamos'}
          </h3>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Acción</th>
              <th>Detalle / Libro</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {(esAdmin ? actividadGlobal : misPrestamos).map((actividad) => (
              <tr key={actividad.id}>
                <td><strong>{actividad.usuario}</strong></td>
                <td>{actividad.accion}</td>
                <td>{actividad.detalle}</td>
                <td>{actividad.fecha}</td>
                <td>
                  <span className={getBadgeClass(actividad.estado)}>
                    {actividad.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}