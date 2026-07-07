package bookstack.catalog.repository;

import bookstack.catalog.model.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface BookRepository extends MongoRepository<Book, String> {

    // Spring Boot escribirá la consulta a MongoDB automáticamente por nosotros
    Optional<Book> findByIsbn(String isbn);
}