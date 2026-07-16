// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from "../../services/authService";
import styles from './Login.module.css';

export default function Login() {
  const [credenciales, setCredenciales] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);

  // Nuevo estado para controlar la visibilidad de la contraseña
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(credenciales);
      localStorage.setItem('token', data.token);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  // Función que cambia entre true y false
  const togglePassword = () => {
    setMostrarPassword(!mostrarPassword);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>

        <div className={styles.header}>
          {/* Título y subtítulo castellanizados */}
          <h1 className={styles.title}>BOOKSTACK</h1>
          <p className={styles.subtitle}>Conocimiento • Cultura • Legado</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              name="username"
              className={styles.input}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Contraseña</label>
            {/* Contenedor relativo para el input y el botón */}
            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={mostrarPassword ? "text" : "password"} // Cambia el tipo dinámicamente
                name="password"
                className={styles.input}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={togglePassword}
                className={styles.toggleButton}
                tabIndex="-1" // Evita que el tabulador se detenga en este botón al llenar el formulario
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Ingresar al Catálogo
          </button>
        </form>

        {error && <div className={styles.error}>{error}</div>}

      </div>
    </div>
  );
}