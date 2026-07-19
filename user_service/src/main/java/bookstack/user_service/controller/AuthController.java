package bookstack.user_service.controller;

import bookstack.user_service.model.Usuario;
import bookstack.user_service.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;

    // Endpoint público para iniciar sesión
    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credenciales) {
        try {
            String token = usuarioService.login(credenciales.get("username"), credenciales.get("password"));
            return ResponseEntity.ok(Map.of("token", token));
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para registrar usuarios (Por el momento permite registrar para crear tu primer Admin)
    @PostMapping("/users")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para listar todos los usuarios
    @GetMapping("/users")
    public ResponseEntity<?> listarTodos() {
        try {
            return ResponseEntity.ok(usuarioService.obtenerTodos());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para buscar un usuario por ID
    @GetMapping("/users/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(usuarioService.obtenerPorId(id));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para editar un usuario
    @PutMapping("/users/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            Usuario actualizado = usuarioService.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint para eliminar un usuario
    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        }
    }
}