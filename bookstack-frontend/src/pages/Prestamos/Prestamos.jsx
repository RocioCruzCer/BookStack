import styles from './GestionPrestamos.module.css';

export default function GestionPrestamos() {
  // =========================================================================
  // DATOS ESTÁTICOS (Mock data)
  // =========================================================================
  const prestamos = [
    {
      id: 101,
      usuario: '@juan.perez',
      libro: 'El Señor de los Anillos',
      fechaPrestamo: '2026-07-01',
      fechaVencimiento: '2026-07-15',
      estado: 'Activo'
    },
    {
      id: 102,
      usuario: '@maria.gomez',
      libro: 'Cien Años de Soledad',
      fechaPrestamo: '2026-06-20',
      fechaVencimiento: '2026-07-04',
      estado: 'Devuelto'
    },
    {
      id: 103,
      usuario: '@carlos.ruiz',
      libro: '1984',
      fechaPrestamo: '2026-06-25',
      fechaVencimiento: '2026-07-09',
      estado: 'Vencido'
    },
    {
      id: 104,
      usuario: '@ana.lopez',
      libro: 'Hábitos Atómicos',
      fechaPrestamo: '2026-07-10',
      fechaVencimiento: '2026-07-24',
      estado: 'Activo'
    }
  ];

  // Función para determinar el estilo de la etiqueta de estado
  const getBadgeClass = (estado) => {
    switch (estado) {
      case 'Activo': return `${styles.badge} ${styles.badgeActivo}`;
      case 'Devuelto': return `${styles.badge} ${styles.badgeDevuelto}`;
      case 'Vencido': return `${styles.badge} ${styles.badgeVencido}`;
      default: return styles.badge;
    }
  };

  return (
    <div>
      {/* Cabecera */}
      <div className={styles.headerContainer}>
        <h1 className={styles.pageTitle}>Gestión de Préstamos</h1>
        <button className={styles.btnAdd}>+ Registrar Préstamo</button>
      </div>

      {/* Controles de Búsqueda y Filtro */}
      <div className={styles.controlsContainer}>
        <input
          type="text"
          placeholder="Buscar por ID, usuario o libro..."
          className={styles.searchInput}
        />
        <select className={styles.filterSelect}>
          <option value="TODOS">Todos los estados</option>
          <option value="ACTIVO">Solo Activos</option>
          <option value="VENCIDO">Solo Vencidos</option>
          <option value="DEVUELTO">Devueltos</option>
        </select>
      </div>

      {/* Tabla de Préstamos */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Libro</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Límite</th>
              <th>Estado</th>
              <th style={{ textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map((prestamo) => (
              <tr key={prestamo.id}>
                <td><strong>#{prestamo.id}</strong></td>
                <td>{prestamo.usuario}</td>
                <td>{prestamo.libro}</td>
                <td>{prestamo.fechaPrestamo}</td>
                <td>{prestamo.fechaVencimiento}</td>
                <td>
                  <span className={getBadgeClass(prestamo.estado)}>
                    {prestamo.estado}
                  </span>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {prestamo.estado !== 'Devuelto' ? (
                    <button className={styles.btnAction}>
                      Marcar Devuelto
                    </button>
                  ) : (
                    <span style={{ color: '#aaa', fontSize: '0.9em' }}>Sin acciones</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}