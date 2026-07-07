package bookstack.catalog.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Data
@Document(collection = "libros")
public class Book {

    @Id
    private String id;

    @Indexed(unique = true)
    private String isbn;

    private String titulo;
    private String autor;
    private String categoria;
    private Integer copiasDisponibles;
    private String editorial;
    private String fechaPublicacion;
    private String fotoUrl;
    private String status = "REGISTRADO"; // Valor por defecto
}