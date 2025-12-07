import { useState, useEffect } from 'react';
import {
    Link,
    useLocation,
    useNavigate,
    useSearchParams,
} from 'react-router-dom';
import { Book, Video as VideoIcon, Search } from 'lucide-react';

export default function Navbar() {
    const path = useLocation().pathname;
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Sincronizar el input con la URL (por si refrescas la página)
    const initialQuery = searchParams.get('q') || '';
    const [searchTerm, setSearchTerm] = useState(initialQuery);

    // Efecto para limpiar la barra si navegas fuera de search (opcional, gusto personal)
    useEffect(() => {
        if (path !== '/search') {
            setSearchTerm('');
        } else {
            setSearchTerm(searchParams.get('q') || '');
        }
    }, [path, searchParams]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        // Magia: Si hay texto, vamos a /search. Si no, volvemos al home o nos quedamos.
        if (value.trim()) {
            navigate(`/search?q=${encodeURIComponent(value)}`);
        } else {
            // Si el usuario borra todo, ¿qué hacemos?
            // Opción A: Ir al Home
            // navigate('/');
            // Opción B: Quedarse en /search vacío (usaremos esta)
            navigate('/search');
        }
    };

    const isActive = (p: string) => {
        if (p === '/' && (path === '/' || path === '/videos')) return true;
        if (p === '/books' && path === '/books') return true;
        return false;
    };

    const navItemClass = (p: string) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 relative group ${
            isActive(p)
                ? 'text-gruv-aqua font-bold bg-gruv-aqua/10'
                : 'text-gray-400 hover:text-gruv-green hover:bg-white/5'
        }`;

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-gruv-dark/80 border-b border-gray-700/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <Link
                        to="/"
                        className="text-2xl font-bold text-gruv-yellow tracking-wider hover:opacity-80 transition-opacity whitespace-nowrap"
                    >
                        Personal<span className="text-gruv-aqua">DB</span>
                    </Link>

                    {/* BARRA UNIVERSAL */}
                    <div className="flex-1 max-w-md relative group">
                        <div
                            className={`absolute inset-0 bg-gruv-aqua/20 rounded-full blur-md transition-opacity duration-300 ${
                                searchTerm ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar en toda la colección..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full bg-black/40 border border-gray-600 rounded-full py-2 pl-10 pr-4 text-gruv-green placeholder-gray-500 focus:outline-none focus:border-gruv-aqua focus:ring-1 focus:ring-gruv-aqua transition-all shadow-inner"
                            />
                            <Search
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-gruv-aqua transition-colors"
                                size={16}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Link to="/" className={navItemClass('/')}>
                            <VideoIcon size={18} />
                            <span className="hidden md:inline">Videos</span>
                        </Link>

                        <Link to="/books" className={navItemClass('/books')}>
                            <Book size={18} />
                            <span className="hidden md:inline">Books</span>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
