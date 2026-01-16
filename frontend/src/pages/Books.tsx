import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api/books';
import ViewToggle from '../components/ViewToggle';
import Pagination from '../components/Pagination';
import PaginationToggle from '../components/PaginationToggle'; // <--- IMPORTAR

interface Category {
    id: number;
    name: string;
}

interface Book {
    id: number;
    title: string;
    link: string;
    cover: string;
    Categories?: Category[];
}

const ITEMS_PER_PAGE = 60;

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // 1. ESTADO DE PAGINACIÓN
    const [paginationEnabled, setPaginationEnabled] = useState(() => {
        const saved = localStorage.getItem('paginationEnabled');
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [columns, setColumns] = useState<number>(() => {
        const saved = localStorage.getItem('gridColumns');
        return saved ? parseInt(saved) : 3;
    });

    useEffect(() => {
        localStorage.setItem('gridColumns', columns.toString());
    }, [columns]);

    // 2. GUARDAR PREFERENCIA
    useEffect(() => {
        localStorage.setItem(
            'paginationEnabled',
            JSON.stringify(paginationEnabled),
        );
        if (paginationEnabled) setCurrentPage(1);
    }, [paginationEnabled]);

    const fetchBooks = async () => {
        try {
            const data = await getBooks();
            setBooks(data);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('¿Seguro que quieres borrar este libro?')) {
            try {
                await deleteBook(id.toString());
                fetchBooks();
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    const getGridClass = () => {
        switch (columns) {
            case 4:
                return 'grid-cols-1 md:grid-cols-3 lg:grid-cols-4';
            case 6:
                return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
            case 8:
                return 'grid-cols-3 md:grid-cols-6 lg:grid-cols-8';
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        }
    };

    // --- LÓGICA HÍBRIDA ---
    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;

    const currentBooks = paginationEnabled
        ? books.slice(indexOfFirstItem, indexOfLastItem)
        : books;

    const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Link
                    to="/add?type=book"
                    className="w-full md:w-auto flex items-center justify-center bg-gruv-aqua text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-gruv-green transition-transform hover:scale-105 shadow-lg"
                >
                    <Plus className="mr-2" /> Add a Book
                </Link>

                <div className="flex items-center gap-4">
                    <PaginationToggle
                        isEnabled={paginationEnabled}
                        toggle={() => setPaginationEnabled(!paginationEnabled)}
                    />
                    <div className="h-8 w-[1px] bg-gray-700 mx-2 hidden sm:block"></div>
                    <ViewToggle columns={columns} setColumns={setColumns} />
                </div>
            </div>

            <div className={`grid gap-4 ${getGridClass()}`}>
                {currentBooks.map((book) => (
                    <ItemCard
                        key={book.id}
                        id={book.id}
                        type="book"
                        thumbnail={`http://localhost:3000/uploads/${book.cover}`}
                        title={book.title}
                        link={book.link}
                        categories={
                            book.Categories?.map((c: any) => c.name) || []
                        }
                        onDelete={() => handleDelete(book.id)}
                    />
                ))}
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
                Mostrando {currentBooks.length} de {books.length} libros
                {paginationEnabled
                    ? ` (Página ${currentPage})`
                    : ' (Vista Completa)'}
                .
            </p>

            {paginationEnabled && totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
}
