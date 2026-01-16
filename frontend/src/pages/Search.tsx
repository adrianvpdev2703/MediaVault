import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks, deleteBook } from '../api/books';
import { getVideos, deleteVideo } from '../api/videos';
import ItemCard from '../components/ItemCard';
import ViewToggle from '../components/ViewToggle';
import Pagination from '../components/Pagination';
import PaginationToggle from '../components/PaginationToggle';
import { Search as SearchIcon, Filter, X, Tag, ListFilter } from 'lucide-react';

interface UniversalItem {
    id: number;
    uniqueKey: string;
    type: 'book' | 'video';
    title: string;
    link: string;
    thumbnail: string;
    categories: string[];
}

const ITEMS_PER_PAGE = 60;

export default function Search() {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [allItems, setAllItems] = useState<UniversalItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Filtros seleccionados (lógica AND)
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

    // --- NUEVO: ESTADO PARA BUSCAR DENTRO DE LAS CATEGORÍAS ---
    const [categorySearch, setCategorySearch] = useState('');

    // Configuraciones
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
    useEffect(() => {
        localStorage.setItem(
            'paginationEnabled',
            JSON.stringify(paginationEnabled),
        );
    }, [paginationEnabled]);
    useEffect(() => {
        setCurrentPage(1);
    }, [query, selectedFilters, paginationEnabled]);

    // 1. CARGAR DATOS
    useEffect(() => {
        const loadEverything = async () => {
            setLoading(true);
            try {
                const [booksData, videosData] = await Promise.all([
                    getBooks(),
                    getVideos(),
                ]);

                const normalizedBooks = booksData.map((b: any) => ({
                    id: b.id,
                    uniqueKey: `book-${b.id}`,
                    type: 'book',
                    title: b.title,
                    link: b.link,
                    thumbnail: `http://localhost:3000/uploads/${b.cover}`,
                    categories: b.Categories
                        ? b.Categories.map((c: any) => c.name)
                        : [],
                }));

                const normalizedVideos = videosData.map((v: any) => ({
                    id: v.id,
                    uniqueKey: `video-${v.id}`,
                    type: 'video',
                    title: v.title,
                    link: v.link,
                    thumbnail: `http://localhost:3000/uploads/${v.thumbnail}`,
                    categories: v.Categories
                        ? v.Categories.map((c: any) => c.name)
                        : [],
                }));

                setAllItems([...normalizedBooks, ...normalizedVideos]);
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setLoading(false);
            }
        };
        loadEverything();
    }, []);

    // 2. EXTRAER CATEGORÍAS
    const availableCategories = useMemo(() => {
        const cats = new Set<string>();
        allItems.forEach((item) => item.categories.forEach((c) => cats.add(c)));
        return Array.from(cats).sort();
    }, [allItems]);

    // 3. LOGICA DE FILTRADO DE LA LISTA DE CATEGORÍAS (UX MEJORADA)
    const visibleCategories = useMemo(() => {
        // Si no hay búsqueda de categoría, mostramos todo (o las seleccionadas primero)
        if (!categorySearch) return availableCategories;

        // Si hay búsqueda, filtramos la lista
        return availableCategories.filter((cat) =>
            cat.toLowerCase().includes(categorySearch.toLowerCase()),
        );
    }, [availableCategories, categorySearch]);

    const toggleFilter = (cat: string) => {
        if (selectedFilters.includes(cat)) {
            setSelectedFilters((prev) => prev.filter((c) => c !== cat));
        } else {
            setSelectedFilters((prev) => [...prev, cat]);
            setCategorySearch(''); // Opcional: Limpiar búsqueda al seleccionar para ver todo de nuevo
        }
    };

    // Detección de clic desde tarjeta
    useEffect(() => {
        if (
            query &&
            availableCategories.includes(query) &&
            selectedFilters.length === 0
        ) {
            setSelectedFilters([query]);
            setSearchParams({}, { replace: true });
        }
    }, [query, availableCategories, setSearchParams]);

    // 4. FILTRADO DE ITEMS (RESULTADOS)
    const filteredItems = useMemo(() => {
        return allItems.filter((item) => {
            const textMatch = query
                ? item.title.toLowerCase().includes(query.toLowerCase())
                : true;
            const categoryMatch =
                selectedFilters.length === 0
                    ? true
                    : selectedFilters.every((filter) =>
                          item.categories.includes(filter),
                      );
            return textMatch && categoryMatch;
        });
    }, [query, allItems, selectedFilters]);

    // Borrado
    const handleDelete = async (
        id: number,
        type: 'book' | 'video',
        uniqueKey: string,
    ) => {
        if (confirm('¿Eliminar permanentemente?')) {
            try {
                if (type === 'book') await deleteBook(id.toString());
                else await deleteVideo(id.toString());
                setAllItems((prev) =>
                    prev.filter((item) => item.uniqueKey !== uniqueKey),
                );
            } catch (error) {
                console.error(error);
            }
        }
    };

    const getGridClass = () => {
        switch (columns) {
            case 6:
                return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6';
            case 8:
                return 'grid-cols-3 md:grid-cols-6 lg:grid-cols-8';
            default:
                return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
        }
    };

    const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
    const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
    const currentItems = paginationEnabled
        ? filteredItems.slice(indexOfFirstItem, indexOfLastItem)
        : filteredItems;
    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-6 animate-fade-in pb-20">
            <div className="flex flex-col gap-4 border-b border-gray-700 pb-6">
                <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gruv-yellow flex items-center gap-3">
                            <SearchIcon className="text-gruv-aqua" />
                            Buscador Avanzado
                        </h1>
                        <p className="text-gray-400 mt-2 text-sm">
                            {loading
                                ? 'Cargando...'
                                : `Encontrados: ${filteredItems.length}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <PaginationToggle
                            isEnabled={paginationEnabled}
                            toggle={() =>
                                setPaginationEnabled(!paginationEnabled)
                            }
                        />
                        <div className="h-8 w-[1px] bg-gray-700 mx-2 hidden sm:block"></div>
                        <ViewToggle columns={columns} setColumns={setColumns} />
                    </div>
                </div>

                {/* --- ZONA DE FILTROS MEJORADA --- */}
                <div className="bg-black/20 p-4 rounded-xl border border-gray-700/50 mt-2">
                    {/* Header de la caja de filtros + BUSCADOR INTERNO */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-wider">
                            <Filter size={14} />
                            Categorías ({visibleCategories.length})
                        </div>

                        {/* BUSCADOR DE CATEGORÍAS */}
                        <div className="relative w-full sm:w-64">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <ListFilter
                                    size={14}
                                    className="text-gray-500"
                                />
                            </div>
                            <input
                                type="text"
                                placeholder="Filtrar etiquetas..."
                                value={categorySearch}
                                onChange={(e) =>
                                    setCategorySearch(e.target.value)
                                }
                                className="w-full bg-gruv-dark border border-gray-600 rounded-md py-1.5 pl-9 pr-8 text-sm text-gruv-green placeholder-gray-600 focus:outline-none focus:border-gruv-aqua transition-colors"
                            />
                            {categorySearch && (
                                <button
                                    onClick={() => setCategorySearch('')}
                                    className="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-500 hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* VISUALIZADOR DE FILTROS ACTIVOS (Para que no se pierdan al filtrar la lista) */}
                    {selectedFilters.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3 pb-3 border-b border-gray-700/50">
                            <span className="text-xs text-gray-500 flex items-center">
                                Activas:
                            </span>
                            {selectedFilters.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => toggleFilter(cat)}
                                    className="px-3 py-1 rounded-full text-xs font-bold border bg-gruv-aqua text-white border-gruv-aqua shadow-lg flex items-center gap-1 hover:bg-gruv-red hover:border-gruv-red transition-colors"
                                    title="Clic para quitar"
                                >
                                    <Tag size={10} className="fill-current" />
                                    {cat}
                                    <X size={10} className="ml-1" />
                                </button>
                            ))}
                            <button
                                onClick={() => setSelectedFilters([])}
                                className="ml-auto text-xs text-gruv-red hover:underline"
                            >
                                Limpiar todas
                            </button>
                        </div>
                    )}

                    {/* LISTA DE CATEGORÍAS (Filtrada) */}
                    <div className="flex flex-wrap gap-2 max-h-[120px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
                        {visibleCategories.length > 0 ? (
                            visibleCategories.map((cat) => {
                                // Si ya está seleccionada, no la mostramos aquí abajo para no duplicar visualmente
                                // O la mostramos desactivada. Yo prefiero ocultarla de abajo si ya está arriba en "Activas".
                                if (selectedFilters.includes(cat)) return null;

                                return (
                                    <button
                                        key={cat}
                                        onClick={() => toggleFilter(cat)}
                                        className="px-3 py-1.5 rounded-full text-xs font-bold border bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-white transition-all duration-200"
                                    >
                                        {cat}
                                    </button>
                                );
                            })
                        ) : (
                            <span className="text-gray-600 text-xs italic py-2">
                                No se encontraron etiquetas con ese nombre.
                            </span>
                        )}
                    </div>
                </div>

                {/* Resumen */}
                {query && (
                    <div className="flex items-center gap-2 text-sm text-gray-300 bg-gruv-dark p-2 rounded-lg border border-gray-700 mt-2">
                        <span className="text-gray-500">
                            Buscando por título:
                        </span>
                        <span className="px-2 py-0.5 bg-white/10 rounded text-white border border-white/20">
                            "{query}"
                        </span>
                    </div>
                )}
            </div>

            {/* GRID */}
            {loading ? (
                <div className="text-center py-20 text-gray-500 animate-pulse">
                    Cargando colección...
                </div>
            ) : (
                <div className={`grid gap-4 ${getGridClass()}`}>
                    {currentItems.map((item) => (
                        <ItemCard
                            key={item.uniqueKey}
                            id={item.id}
                            type={item.type as 'book' | 'video'}
                            thumbnail={item.thumbnail}
                            title={item.title}
                            link={item.link}
                            categories={item.categories}
                            onDelete={() =>
                                handleDelete(item.id, item.type, item.uniqueKey)
                            }
                        />
                    ))}
                </div>
            )}

            {!loading && filteredItems.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                    <Filter size={64} className="mb-4 text-gray-700" />
                    <h2 className="text-xl font-bold">Sin coincidencias</h2>
                    <p>
                        No hay elementos que coincidan con los filtros actuales.
                    </p>
                </div>
            )}

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
