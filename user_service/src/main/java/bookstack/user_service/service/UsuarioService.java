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
}