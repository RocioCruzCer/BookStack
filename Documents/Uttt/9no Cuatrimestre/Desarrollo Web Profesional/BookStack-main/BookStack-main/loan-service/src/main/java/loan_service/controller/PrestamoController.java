package loan_service.controller;

import loan_service.dto.PrestamoRequest;
import loan_service.service.PrestamoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/loans")
public class PrestamoController {

    private final PrestamoService prestamoService;

    public PrestamoController(PrestamoService prestamoService) {
        this.prestamoService = prestamoService;
    }

    @PostMapping
    public ResponseEntity<Object> crearPrestamo(@RequestBody PrestamoRequest request) {
        Object response = prestamoService.procesarPrestamo(request);

        // Si es un String, significa que se activó el Circuit Breaker (Fallback)
        if (response instanceof String) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(response);
        }

        // Si es exitoso, devuelve 201 CREATED
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}