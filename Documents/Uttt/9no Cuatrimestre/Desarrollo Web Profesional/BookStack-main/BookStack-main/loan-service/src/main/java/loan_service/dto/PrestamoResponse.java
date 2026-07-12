package loan_service.dto;

import java.time.LocalDate;

public class PrestamoResponse {
    private Long prestamoId;
    private Long usuarioId;
    private String libroIsbn;
    private LocalDate fechaPrestamo;
    private LocalDate fechaDevolucionLimite;
    private String estado;

    public Long getPrestamoId() { return prestamoId; }
    public void setPrestamoId(Long prestamoId) { this.prestamoId = prestamoId; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getLibroIsbn() { return libroIsbn; }
    public void setLibroIsbn(String libroIsbn) { this.libroIsbn = libroIsbn; }
    public LocalDate getFechaPrestamo() { return fechaPrestamo; }
    public void setFechaPrestamo(LocalDate fechaPrestamo) { this.fechaPrestamo = fechaPrestamo; }
    public LocalDate getFechaDevolucionLimite() { return fechaDevolucionLimite; }
    public void setFechaDevolucionLimite(LocalDate fechaDevolucionLimite) { this.fechaDevolucionLimite = fechaDevolucionLimite; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}