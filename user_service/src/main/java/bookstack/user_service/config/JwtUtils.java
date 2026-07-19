package bookstack.user_service.config;

import io.jsonwebtoken.Jwts;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    // Nueva sintaxis 0.12.x para generar una clave secreta segura automáticamente
    private final SecretKey key = Jwts.SIG.HS256.key().build();
    // El token durará 24 horas activo
    private final long jwtExpirationMs = 86400000;

    public String generarToken(String username, String rol) {
        return Jwts.builder()
                .subject(username)                 // .setSubject cambió a .subject en 0.12.x
                .claim("rol", rol)
                .issuedAt(new Date())               // .setIssuedAt cambió a .issuedAt
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs)) // .setExpiration cambió a .expiration
                .signWith(key)                      // .signWith ahora recibe directamente la SecretKey limpia
                .compact();
    }
}