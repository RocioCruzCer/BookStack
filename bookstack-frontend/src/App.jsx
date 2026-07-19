import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 1. Importaciones actualizadas según tu nueva estructura de carpetas
import Login from './pages/Login/Login';
import Home from './pages/Home/Home';
import Dashboard from './pages/Home/Dashboard';
import CatalogoLibros from './pages/CatalogoLibros/CatalogoLibros';
import Prestamos from './pages/Prestamos/Prestamos';
import MisPrestamos from './pages/Prestamos/MisPrestamos';
import Usuarios from './pages/Usuarios/Usuarios';
import MiPerfil from './pages/Usuarios/MiPerfil';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Login />} />

        {/* Rutas privadas (Anidadas dentro de Home) */}
        <Route path="/home" element={<Home />}>
          <Route index element={<Dashboard />} />
          <Route path="perfil" element={<MiPerfil />} />
          <Route path="catalogo" element={<CatalogoLibros />} />
          <Route path="prestamos" element={<Prestamos />} />
          <Route path="mis-prestamos" element={<MisPrestamos />} />
          <Route path="usuarios" element={<Usuarios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}