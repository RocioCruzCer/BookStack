import { useState } from 'react';
import styles from './MisPrestamos.module.css';

export default function MisPrestamos() {
  // Datos estáticos de ejemplo para el usuario logueado
  const [prestamosActivos] = useState([
    {
      id: 1,
      titulo: 'El Señor de los Anillos',
      autor: 'J.R.R. Tolkien',
      fechaPrestamo: '05 Jul 2026',
      fechaDevolucion: '19 Jul 2026',
      diasRestantes: 7,
      estado: 'A tiempo'
    },
    {
      id: 2,
      titulo: '1984',
      autor: 'George Orwell',
      fechaPrestamo: '28 Jun 2026',
      fechaDevolucion: '12 Jul 2026',
      diasRestantes: 0,
      estado: 'Vence Hoy'
    }
  ]);

  const [historialDevoluciones] = useState([
    { id: 101, titulo: 'Hábitos Atómicos', autor: 'James Clear', fechaPrestamo: '15 Jun 2026', fechaDevolucion: '29 Jun 2026', estado: 'Devuelto' },
    { id: 102, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', fechaPrestamo: '01 Jun 2026', fechaDevolucion: '15 Jun 2026', estado: 'Devuelto' }
  ]);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Mis Préstamos</h1>
      <p className={styles.subtitle}>
        Gestiona tus lecturas actuales y revisa las fechas límite para evitar penalizaciones.
      </p>

      {/* =========================================
         SECCIÓN 1: PRÉSTAMOS ACTIVOS (Tarjetas)
      ========================================= */}
      <h2 className={styles.sectionTitle}>Libros en mi posesión ({prestamosActivos.length})</h2>
      <div className={styles.cardsGrid}>
        {prestamosActivos.map((book) => (
          <div key={book.id} className={styles.loanCard}>
            {/* Mini portada simulada a la izquierda */}
            <div className={styles.miniCover}>
              <span>📖</span>
            </div>

            {/* Detalles del préstamo a la derecha */}
            <div className={styles.loanDetails}>
              <h3 className={styles.bookTitle}>{book.titulo}</h3>
              <p className={styles.bookAuthor}>por {book.autor}</p>

              <div className={styles.datesGroup}>
                <p><strong>Prestado el:</strong> {book.fechaPrestamo}</p>
                <p><strong>Entrega límite:</strong> <span className={styles.textBorgona}>{book.fechaDevolucion}</span></p>
              </div>

              <div className={styles.cardFooter}>
                <span className={book.diasRestantes === 0 ? styles.badgeAlerta : styles.badgeInfo}>
                  {book.diasRestantes === 0 ? '¡Vence Hoy!' : `${book.diasRestantes} días restantes`}
                </span>
                <button
                  className={styles.btnRenovar}
                  onClick={() => alert(`Solicitud de renovación enviada para: ${book.titulo}`)}
                >
                  Solicitar Renovación
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
         SECCIÓN 2: HISTORIAL DE DEVOLUCIONES
      ========================================= */}
      <div className={styles.historySection}>
        <h2 className={styles.sectionTitle}>Historial de Lecturas</h2>
        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Libro / Título</th>
                <th>Autor</th>
                <th>Fecha de Préstamo</th>
                <th>Fecha de Entrega</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historialDevoluciones.map((historial) => (
                <tr key={historial.id}>
                  <td><strong>{historial.titulo}</strong></td>
                  <td>{historial.autor}</td>
                  <td>{historial.fechaPrestamo}</td>
                  <td>{historial.fechaDevolucion}</td>
                  <td>
                    <span className={styles.badgeDevuelto}>
                      ✓ {historial.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}