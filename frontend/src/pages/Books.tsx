import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getBooks, deleteBook } from '../api/books';
import ViewToggle from '../components/ViewToggle';

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

export default function Books() {
    const [books, setBooks] = useState<Book[]>([]);

    // 1. ESTADO PARA LAS COLUMNAS (Con memoria local)
    const [columns, setColumns] = useState<number>(() => {
        const saved = localStorage.getItem('gridColumns');
        return saved ? parseInt(saved) : 3; // 3 por defecto
    });

    // 2. Guardar preferencia cuando cambie
    useEffect(() => {
        localStorage.setItem('gridColumns', columns.toString());
    }, [columns]);

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
                fetchBooks(); // Recargar la lista
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    // 3. Lógica para cambiar las clases de CSS según el número elegido
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

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Header con Botón de Agregar y Toggle de Vista */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <Link
                    to="/add?type=book"
                    className="w-full sm:w-auto flex items-center justify-center bg-gruv-aqua text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-gruv-green transition-transform hover:scale-105 shadow-lg"
                >
                    <Plus className="mr-2" /> Add a Book
                </Link>

                {/* AQUÍ ESTÁ EL TOGGLE */}
                <ViewToggle columns={columns} setColumns={setColumns} />
            </div>

            {/* Grid Dinámico */}
            <div className={`grid gap-4 ${getGridClass()}`}>
                {books.map((book) => (
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
                Mostrando {books.length} libros en modo {columns} columnas.
            </p>
        </div>
    );
}
