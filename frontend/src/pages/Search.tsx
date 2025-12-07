import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getBooks, deleteBook } from '../api/books';
import { getVideos, deleteVideo } from '../api/videos';
import ItemCard from '../components/ItemCard';
import ViewToggle from '../components/ViewToggle'; // <--- IMPORTADO
import { Search as SearchIcon } from 'lucide-react';

interface UniversalItem {
    id: number;
    uniqueKey: string;
    type: 'book' | 'video';
    title: string;
    link: string;
    thumbnail: string;
    categories: string[];
}

export default function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [allItems, setAllItems] = useState<UniversalItem[]>([]);
    const [loading, setLoading] = useState(true);

    const [columns, setColumns] = useState<number>(() => {
        const saved = localStorage.getItem('gridColumns');
        return saved ? parseInt(saved) : 3;
    });

    useEffect(() => {
        localStorage.setItem('gridColumns', columns.toString());
    }, [columns]);

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

    const handleDelete = async (
        id: number,
        type: 'book' | 'video',
        uniqueKey: string,
    ) => {
        const confirmMsg =
            type === 'book' ? '¿Borrar libro?' : '¿Borrar video?';
        if (confirm(confirmMsg)) {
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

    const filteredItems = useMemo(() => {
        if (!query) return [];
        const lowerQuery = query.toLowerCase();
        return allItems.filter((item) => {
            const matchTitle = item.title.toLowerCase().includes(lowerQuery);
            const matchCategory = item.categories.some((cat) =>
                cat.toLowerCase().includes(lowerQuery),
            );
            return matchTitle || matchCategory;
        });
    }, [query, allItems]);

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

    return (
        <div className="flex flex-col gap-8 animate-fade-in">
            <div className="border-b border-gray-700 pb-4 flex flex-col sm:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gruv-yellow flex items-center gap-3">
                        <SearchIcon className="text-gruv-aqua" />
                        Buscando:{' '}
                        <span className="text-white italic">"{query}"</span>
                    </h1>
                    <p className="text-gray-400 mt-2 text-sm">
                        {loading
                            ? 'Cargando...'
                            : `Resultados: ${filteredItems.length} (Total: ${allItems.length})`}
                    </p>
                </div>

                <ViewToggle columns={columns} setColumns={setColumns} />
            </div>

            <div className={`grid gap-4 ${getGridClass()}`}>
                {filteredItems.map((item) => (
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
        </div>
    );
}
