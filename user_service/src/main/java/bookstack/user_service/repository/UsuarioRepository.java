package bookstack.user_service.repository;

import bookstack.user_service.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    // Este método nos servirá para buscar si un usuario existe cuando intente hacer login
    Optional<Usuario> findByUsername(String username);
}