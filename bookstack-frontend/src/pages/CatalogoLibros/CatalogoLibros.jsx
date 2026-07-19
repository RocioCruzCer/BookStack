import { useState, useEffect } from 'react';
import styles from './CatalogoLibros.module.css';

export default function CatalogoLibros() {
    const [esAdmin, setEsAdmin] = useState(false);
    const [libros, setLibros] = useState([]);
    const [libroSeleccionado, setLibroSeleccionado] = useState(null);

    const [busqueda, setBusqueda] = useState('');

    const [mostrarModalForm, setMostrarModalForm] = useState(false);
    const [nuevoLibro, setNuevoLibro] = useState({
        isbn: '',
        titulo: '',
        autor: '',
        categoria: '',
        editorial: '',
        copiasDisponibles: 1,
        fechaPublicacion: '',
        fotoUrl: ''
    });

    const API_URL = 'http://localhost:8082/api/books';

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payloadBase64 = token.split('.')[1];
                const payloadDecodificado = JSON.parse(atob(payloadBase64));
                const infoToken = JSON.stringify(payloadDecodificado);
                const adminCheck = infoToken.includes('ROLE_BIBLIOTECARIO') || infoToken.includes('ROLE_ADMIN');
                setEsAdmin(adminCheck);
            } catch (error) {
                console.error("Error decodificando token:", error);
            }
        }
        cargarLibros();
    }, []);

    const cargarLibros = () => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error('Error al conectar con el servidor');
                return res.json();
            })
            .then((data) => setLibros(data))
            .catch((err) => console.error("Error cargando libros:", err));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNuevoLibro({
            ...nuevoLibro,
            [name]: name === 'copiasDisponibles' ? parseInt(value, 10) || 0 : value
        });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecciona un archivo de imagen válido (JPG, PNG, WebP).');
                e.target.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setNuevoLibro({
                    ...nuevoLibro,
                    fotoUrl: reader.result
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGuardarLibro = (e) => {
        e.preventDefault();

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(nuevoLibro)
        })
            .then((res) => {
                if (!res.ok) throw new Error('No se pudo guardar el libro');
                return res.json();
            })
            .then((libroCreado) => {
                setLibros([libroCreado, ...libros]);
                setMostrarModalForm(false);
                setNuevoLibro({ isbn: '', titulo: '', autor: '', categoria: '', editorial: '', copiasDisponibles: 1, fechaPublicacion: '', fotoUrl: '' });
            })
            .catch((err) => {
                alert('Error al registrar el libro. Verifica la conexión.');
                console.error(err);
            });
    };

    const librosFiltrados = libros.filter((libro) => {
        const termino = busqueda.toLowerCase();
        const titulo = libro.titulo ? libro.titulo.toLowerCase() : '';
        const autor = libro.autor ? libro.autor.toLowerCase() : '';

        return titulo.includes(termino) || autor.includes(termino);
    });

    return (
        <div>
            <div className={styles.headerContainer}>
                <h1 className={styles.pageTitle}>Catálogo de Libros</h1>
                {esAdmin && (
                    <button className={styles.btnAdd} onClick={() => setMostrarModalForm(true)}>
                        + Agregar Libro
                    </button>
                )}
            </div>

            <input
                type="text"
                placeholder="Buscar por título, autor..."
                className={styles.searchBar}
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className={styles.booksGrid}>
                {librosFiltrados.map((libro) => {
                    const estaDisponible = libro.copiasDisponibles > 0;
                    return (
                        <div key={libro.id} className={styles.bookCard} onClick={() => setLibroSeleccionado(libro)}>

                            <div className={`${styles.coverWrapper} ${libro.fotoUrl ? styles.hasImage : ''}`}>
                                {libro.fotoUrl ? (
                                    <img
                                        src={libro.fotoUrl}
                                        alt={libro.titulo}
                                        className={styles.bookImage}
                                        onError={() => {
                                            setLibros((prevLibros) =>
                                                prevLibros.map((l) =>
                                                    l.id === libro.id ? { ...l, fotoUrl: null } : l
                                                )
                                            );
                                        }}
                                    />
                                ) : (
                                    <span className={styles.fallbackTitle}>{libro.titulo}</span>
                                )}
                            </div>

                            <div className={styles.bookInfo}>
                                <h3 className={styles.bookTitle}>{libro.titulo}</h3>
                                <p className={styles.bookAuthor}>{libro.autor}</p>
                                <span className={estaDisponible ? styles.badgeDisponible : styles.badgePrestado}>
                                  {estaDisponible ? `● Disponible (${libro.copiasDisponibles})` : '● Agotado'}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {mostrarModalForm && (
                <div className={styles.modalOverlay} onClick={() => setMostrarModalForm(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.modalTitle}>Nuevo Registro de Libro</h2>

                        <form onSubmit={handleGuardarLibro} className={styles.modalForm}>
                            <div className={styles.formGroup}>
                                <label className={styles.formGroupLabel}>Título del Libro</label>
                                <input type="text" name="titulo" required value={nuevoLibro.titulo} onChange={handleInputChange} className={styles.formInput} placeholder="Ej. El Alquimista" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formGroupLabel}>Autor</label>
                                <input type="text" name="autor" required value={nuevoLibro.autor} onChange={handleInputChange} className={styles.formInput} placeholder="Ej. Paulo Coelho" />
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formGroupLabel}>ISBN</label>
                                    <input type="text" name="isbn" required value={nuevoLibro.isbn} onChange={handleInputChange} className={styles.formInput} placeholder="978-3-16..." />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formGroupLabel}>Copias Iniciales</label>
                                    <input type="number" name="copiasDisponibles" min="1" required value={nuevoLibro.copiasDisponibles} onChange={handleInputChange} className={styles.formInput} />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formGroupLabel}>Categoría / Género</label>
                                    <input type="text" name="categoria" value={nuevoLibro.categoria} onChange={handleInputChange} className={styles.formInput} placeholder="Ej. Novela" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formGroupLabel}>Editorial</label>
                                    <input type="text" name="editorial" value={nuevoLibro.editorial} onChange={handleInputChange} className={styles.formInput} placeholder="Ej. Planeta" />
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formGroupLabel}>Fecha de Publicación (Opc.)</label>
                                    <input type="date" name="fechaPublicacion" value={nuevoLibro.fechaPublicacion} onChange={handleInputChange} className={styles.formInput} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.formGroupLabel}>Subir Portada (Opc.)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className={styles.fileInput}
                                    />
                                </div>
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" className={styles.btnActionSecondary} onClick={() => setMostrarModalForm(false)}>Cancelar</button>
                                <button type="submit" className={styles.btnActionPrimary}>Guardar en Catálogo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {libroSeleccionado && (() => {
                const estaDisponible = libroSeleccionado.copiasDisponibles > 0;
                return (
                    <div className={styles.panelOverlay} onClick={() => setLibroSeleccionado(null)}>
                        <div className={styles.actionsPanel} onClick={(e) => e.stopPropagation()}>
                            <button className={styles.btnClosePanel} onClick={() => setLibroSeleccionado(null)}>← Volver al catálogo</button>

                            {libroSeleccionado.fotoUrl && (
                                <img src={libroSeleccionado.fotoUrl} alt={libroSeleccionado.titulo} className={styles.panelCoverPreview} />
                            )}

                            <h2 className={styles.panelBookTitle}>{libroSeleccionado.titulo}</h2>
                            <p className={styles.panelBookAuthor}>por {libroSeleccionado.autor}</p>

                            <div style={{ marginBottom: '20px' }}>
                                <h5 style={{ color: '#888', margin: '0 0 5px 0', textTransform: 'uppercase', fontSize: '0.8em' }}>Detalles</h5>
                                <p style={{ color: '#444', margin: 0, fontSize: '0.95em' }}>
                                    <strong>Categoría:</strong> {libroSeleccionado.categoria || 'General'}<br />
                                    <strong>Editorial:</strong> {libroSeleccionado.editorial || 'No especificada'}<br />
                                    {libroSeleccionado.fechaPublicacion && (
                                        <><strong>Publicado:</strong> {libroSeleccionado.fechaPublicacion}</>
                                    )}
                                </p>
                            </div>

                            <div style={{ marginBottom: '20px' }}>
                <span className={estaDisponible ? styles.badgeDisponible : styles.badgePrestado}>
                  Estado: {estaDisponible ? 'Disponible para préstamo' : 'No disponible'}
                </span>
                            </div>

                            <hr style={{ border: '0', borderTop: '1px solid #eaeaea', margin: '10px 0 20px 0' }} />

                            <div className={styles.actionsGroup}>
                                {esAdmin ? (
                                    <>
                                        <h4 style={{ color: '#444', margin: '0 0 5px 0' }}>Gestión Administrativa:</h4>
                                        {estaDisponible ? (
                                            <button className={styles.btnActionPrimary} onClick={() => alert('Préstamo registrado')}>Registrar Préstamo Manual</button>
                                        ) : (
                                            <button className={styles.btnActionSecondary} onClick={() => alert('Devolución registrada')}>Registrar Devolución</button>
                                        )}
                                        <button className={styles.btnActionDanger} onClick={() => alert('Libro eliminado')}>Eliminar de la Biblioteca</button>
                                    </>
                                ) : (
                                    <>
                                        <h4 style={{ color: '#444', margin: '0 0 5px 0' }}>Opciones del Lector:</h4>
                                        <button className={styles.btnActionPrimary} disabled={!estaDisponible} onClick={() => alert(`Solicitado: ${libroSeleccionado.titulo}`)}>
                                            {estaDisponible ? 'Solicitar Préstamo' : 'Reservar (No disponible)'}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}