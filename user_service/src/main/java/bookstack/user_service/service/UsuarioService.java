package bookstack.user_service.service;

import bookstack.user_service.config.JwtUtils;
import bookstack.user_service.model.Usuario;
import bookstack.user_service.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    // Lógica para registrar un usuario nuevo (Solo Administradores usarán esto)
    public Usuario registrarUsuario(Usuario usuario) {
        // Encriptamos la contraseña con BCrypt antes de guardarla en Postgres
        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        // Aseguramos que el rol lleve el prefijo estándar de Spring Security
        if (!usuario.getRol().startsWith("ROLE_")) {
            usuario.setRol("ROLE_" + usuario.getRol().toUpperCase());
        }
        return usuarioRepository.save(usuario);
    }

    // Lógica para el Login Corporativo
    public String login(String username, String password) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(username);

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            // Comparamos la contraseña que ingresó con la encriptada en la BD
            if (passwordEncoder.matches(password, usuario.getPassword())) {
                // Si coinciden, generamos su pase de acceso (Token JWT)
                return jwtUtils.generarToken(usuario.getUsername(), usuario.getRol());
            }
        }
        throw new RuntimeException("Credenciales incorrectas o usuario no encontrado");
    }

    // Obtener todos los usuarios (Para que el Admin los vea en una tabla)
    public java.util.List<Usuario> obtenerTodos() {
        return usuarioRepository.findAll();
    }

    // Obtener un usuario por su ID
    public Usuario obtenerPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado con el ID: " + id));
    }

    // Eliminar un usuario
    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("No se puede eliminar. Usuario no encontrado con el ID: " + id);
        }
        usuarioRepository.deleteById(id);
    }

    // Actualizar un usuario existente
    public Usuario actualizarUsuario(Long id, Usuario datosActualizados) {
        Usuario usuarioExistente = obtenerPorId(id);

        usuarioExistente.setNombre(datosActualizados.getNombre());
        usuarioExistente.setUsername(datosActualizados.getUsername());

        // Si el admin mandó una contraseña nueva, la encriptamos antes de guardarla
        if (datosActualizados.getPassword() != null && !datosActualizados.getPassword().isBlank()) {
            usuarioExistente.setPassword(passwordEncoder.encode(datosActualizados.getPassword()));
        }

        // Formatear el rol si cambió
        if (datosActualizados.getRol() != null) {
            String nuevoRol = datosActualizados.getRol();
            if (!nuevoRol.startsWith("ROLE_")) {
                nuevoRol = "ROLE_" + nuevoRol.toUpperCase();
            }
            usuarioExistente.setRol(nuevoRol);
        }

        return usuarioRepository.save(usuarioExistente);
    }
}