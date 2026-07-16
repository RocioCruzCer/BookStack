import { useState, useEffect } from 'react';
import styles from './CatalogoLibros.module.css';

export default function CatalogoLibros() {
  const [esAdmin, setEsAdmin] = useState(false);

  // Efecto para verificar el rol del usuario desde el token real del ApiGateway
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadDecodificado = JSON.parse(atob(payloadBase64));

        // Comprobamos si es administrador
        const adminCheck = JSON.stringify(payloadDecodificado).includes('ROLE_ADMIN');
        setEsAdmin(adminCheck);
      } catch (error) {
        console.error("Error decodificando token en Catálogo:", error);
      }
    }
  }, []);

  const [libros] = useState([
    { id: 1, titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien', disponible: true, descripcion: 'Una épica aventura en la Tierra Media donde un joven hobbit tiene la misión de destruir el Anillo Único para derrotar al Señor Oscuro Sauron.' },
    { id: 2, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez', disponible: false, descripcion: 'La célebre e inolvidable historia de la familia Buendía a lo largo de siete generaciones en el mítico pueblo de Macondo.' },
    { id: 3, titulo: '1984', autor: 'George Orwell', disponible: true, descripcion: 'Una alarmante e inquietante novela distópica sobre el control absoluto del Gran Hermano, la manipulación de la información y la pérdida de la privacidad.' },
    { id: 4, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes', disponible: true, descripcion: 'Las divertidas y reflexivas aventuras de un hidalgo Alonso Quijano que, tras perder la cabeza por leer libros de caballería, decide convertirse en caballero andante.' },
    { id: 5, titulo: 'Hábitos Atómicos', autor: 'James Clear', disponible: false, descripcion: 'Una guía práctica basada en la ciencia para descubrir cómo pequeños cambios de apenas el 1% diario pueden transformar radicalmente tus rutinas y tu vida.' },
    { id: 6, titulo: 'Crónica de una Muerte Anunciada', autor: 'Gabriel García Márquez', disponible: true, descripcion: 'Una fascinante novela corta que relata en forma de crónica periodística el inevitable y conocido asesinato de Santiago Nasar.' }
  ]);

  const [libroSeleccionado, setLibroSeleccionado] = useState(null);

  return (
    <div>
      {/* Cabecera de la sección */}
      <div className={styles.headerContainer}>
        <h1 className={styles.pageTitle}>Catálogo de Libros</h1>
        {/* Render condicional: Solo el Admin puede agregar libros */}
        {esAdmin && <button className={styles.btnAdd}>+ Agregar Libro</button>}
      </div>

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar por título, autor..."
        className={styles.searchBar}
      />

      {/* Grid de Libros Minimalistas */}
      <div className={styles.booksGrid}>
        {libros.map((libro) => (
          <div
            key={libro.id}
            className={styles.bookCard}
            onClick={() => setLibroSeleccionado(libro)}
          >
            <div className={styles.coverWrapper}>
              <span className={styles.fallbackTitle}>{libro.titulo}</span>
            </div>

            <div className={styles.bookInfo}>
              <h3 className={styles.bookTitle}>{libro.titulo}</h3>
              <p className={styles.bookAuthor}>{libro.autor}</p>
              <span className={libro.disponible ? styles.badgeDisponible : styles.badgePrestado}>
                {libro.disponible ? '● Disponible' : '● Prestado'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================= */}
      {/* SIDE PANEL / DRAWER DE ACCIONES (CONTROLADO POR ROL)      */}
      {/* ========================================================= */}
      {libroSeleccionado && (
        <div className={styles.panelOverlay} onClick={() => setLibroSeleccionado(null)}>
          <div className={styles.actionsPanel} onClick={(e) => e.stopPropagation()}>

            <button className={styles.btnClosePanel} onClick={() => setLibroSeleccionado(null)}>
              ← Volver al catálogo
            </button>

            <h2 className={styles.panelBookTitle}>{libroSeleccionado.titulo}</h2>
            <p className={styles.panelBookAuthor}>por {libroSeleccionado.autor}</p>

            {/* Nueva sección de sinopsis/descripción del libro */}
            <div style={{ marginBottom: '20px' }}>
              <h5 style={{ color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', fontSize: '0.8em' }}>Sinopsis</h5>
              <p style={{ color: '#444', margin: 0, fontSize: '0.95em', lineHeight: '1.5', textAlign: 'justify' }}>
                {libroSeleccionado.descripcion || 'Sin descripción disponible por el momento.'}
              </p>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span className={libroSeleccionado.disponible ? styles.badgeDisponible : styles.badgePrestado}>
                Estado: {libroSeleccionado.disponible ? 'Disponible para préstamo' : 'No disponible en este momento'}
              </span>
            </div>

            <hr style={{ border: '0', borderTop: '1px solid #eaeaea', margin: '10px 0 20px 0' }} />

            {/* VISTA SEGÚN ROLES */}
            <div className={styles.actionsGroup}>
              {esAdmin ? (
                /* =========================================
                   ACCIONES EXCLUSIVAS DEL ADMINISTRADOR
                ========================================= */
                <>
                  <h4 style={{ color: '#444', margin: '0 0 5px 0' }}>Gestión Administrativa:</h4>
                  {libroSeleccionado.disponible ? (
                    <button className={styles.btnActionPrimary} onClick={() => alert('Préstamo registrado por Admin')}>
                      Registrar Préstamo Manual
                    </button>
                  ) : (
                    <button className={styles.btnActionSecondary} onClick={() => alert('Devolución registrada por Admin')}>
                      Registrar Devolución Recibida
                    </button>
                  )}

                  <button className={styles.btnActionSecondary} onClick={() => alert('Abriendo edición...')}>
                    Editar Información del Libro
                  </button>

                  <button className={styles.btnActionDanger} onClick={() => alert('Libro eliminado')}>
                    Eliminar de la Biblioteca
                  </button>
                </>
              ) : (
                /* =========================================
                   ACCIONES EXCLUSIVAS DEL LECTOR (USUARIO)
                ========================================= */
                <>
                  <h4 style={{ color: '#444', margin: '0 0 5px 0' }}>Opciones del Lector:</h4>
                  {libroSeleccionado.disponible ? (
                    <button className={styles.btnActionPrimary} onClick={() => alert(`Has solicitado: ${libroSeleccionado.titulo}`)}>
                      Solicitar Préstamo de este Libro
                    </button>
                  ) : (
                    <button className={styles.btnActionSecondary} disabled style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                      Reservar (No disponible)
                    </button>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}