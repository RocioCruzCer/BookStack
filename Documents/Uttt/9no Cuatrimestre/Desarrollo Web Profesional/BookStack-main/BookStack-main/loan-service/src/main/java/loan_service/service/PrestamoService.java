package loan_service.service;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import loan_service.client.CatalogClient;
import loan_service.client.UserClient;
import loan_service.dto.PrestamoRequest;
import loan_service.dto.PrestamoResponse;
import loan_service.model.Prestamo;
import loan_service.repository.PrestamoRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class PrestamoService {

    private final PrestamoRepository repository;
    private final UserClient userClient;
    private final CatalogClient catalogClient;

    public PrestamoService(PrestamoRepository repository, UserClient userClient, CatalogClient catalogClient) {
        this.repository = repository;
        this.userClient = userClient;
        this.catalogClient = catalogClient;
    }

    @CircuitBreaker(name = "catalogCB", fallbackMethod = "fallbackCrearPrestamo")
    public Object procesarPrestamo(PrestamoRequest request) {

        // Se restauran las validaciones con los otros microservicios
        boolean usuarioValido = userClient.validarUsuario(request.getUsuarioId());
        boolean stockDisponible = catalogClient.verificarStock(request.getLibroIsbn());

        if (!usuarioValido || !stockDisponible) {
            throw new RuntimeException("Usuario inválido o sin stock disponible");
        }

        Prestamo prestamo = new Prestamo();
        prestamo.setUsuarioId(request.getUsuarioId());
        prestamo.setLibroIsbn(request.getLibroIsbn());
        prestamo.setFechaPrestamo(LocalDate.now());
        prestamo.setFechaDevolucionLimite(LocalDate.now().plusDays(request.getDiasPrestamo()));
        prestamo.setEstado("ACTIVO");

        Prestamo guardado = repository.save(prestamo);
        return mapearAResponse(guardado);
    }

    // Se reactiva el método de respaldo para evitar errores 500
    public Object fallbackCrearPrestamo(PrestamoRequest request, Throwable t) {
        return "El servicio de catálogo o usuarios no está disponible temporalmente. Intente más tarde.";
    }

    private PrestamoResponse mapearAResponse(Prestamo p) {
        PrestamoResponse res = new PrestamoResponse();
        res.setPrestamoId(p.getId());
        res.setUsuarioId(p.getUsuarioId());
        res.setLibroIsbn(p.getLibroIsbn());
        res.setFechaPrestamo(p.getFechaPrestamo());
        res.setFechaDevolucionLimite(p.getFechaDevolucionLimite());
        res.setEstado(p.getEstado());
        return res;
    }
}