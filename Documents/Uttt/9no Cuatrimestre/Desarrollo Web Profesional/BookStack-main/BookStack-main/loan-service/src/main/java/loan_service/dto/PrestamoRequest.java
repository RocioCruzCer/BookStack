package loan_service.dto;

public class PrestamoRequest {
    private Long usuarioId;
    private String libroIsbn;
    private int diasPrestamo;

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getLibroIsbn() { return libroIsbn; }
    public void setLibroIsbn(String libroIsbn) { this.libroIsbn = libroIsbn; }
    public int getDiasPrestamo() { return diasPrestamo; }
    public void setDiasPrestamo(int diasPrestamo) { this.diasPrestamo = diasPrestamo; }
}