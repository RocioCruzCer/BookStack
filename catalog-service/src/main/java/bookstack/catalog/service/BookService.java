package bookstack.catalog.service;

import bookstack.catalog.model.Book;
import bookstack.catalog.repository.BookRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;

    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }

    // Método para guardar un libro
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    // Método para obtener todo el catálogo
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Método para buscar un libro específico por su ISBN
    public Book getBookByIsbn(String isbn) {
        return bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new RuntimeException("Libro no encontrado con ISBN: " + isbn));
    }
}