import { useEffect, useState } from 'react';
import ItemCard from '../components/ItemCard';
import ViewToggle from '../components/ViewToggle';
import Pagination from '../components/Pagination';
import PaginationToggle from '../components/PaginationToggle'; // <--- IMPORTAR
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVideos, deleteVideo } from '../api/videos';

interface Category {
    id: number;
    name: string;
}

interface Video {
    id: number;
    title: string;
    link: string;
    thumbnail: string;
    Categories?: Category[];
}

const ITEMS_PER_PAGE = 60;

export default function Videos() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // 1. ESTADO DE PAGINACIÓN (ON/OFF)
    const [paginationEnabled, setPaginationEnabled] = useState(() => {
        const saved = localStorage.getItem('paginationEnabled');
        // Por defecto true, si existe en storage usa el valor guardado
        return saved !== null ? JSON.parse(saved) : true;
    });

    const [columns, setColumns] = useState<number>(() => {
        const saved = localStorage.getItem('gridColumns');
        return saved ? parseInt(saved) : 3;
    });

    // Guardar preferencia de columnas
    useEffect(() => {
        localStorage.setItem('gridColumns', columns.toString());
    }, [columns]);

    // 2. Guardar preferencia de paginación
    useEffect(() => {
        localStorage.setItem(
            'paginationEnabled',
            JSON.stringify(paginationEnabled),
        );
        // Si activamos la paginación, volvemos a la página 1 por seguridad
        if (paginationEnabled) setCurrentPage(1);
    }, [paginationEnabled]);

    const fetchVideos = async () => {
        try {
            const data = await getVideos();
            setVideos(data);
        } catch (error) {
            console.error('Error cargando videos:', error);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleDelete = async (id: number) => {
        if (confirm('¿Seguro que quieres borrar este video?')) {
            try {
                await deleteVideo(id.toString());
                fetchVideos();
            } catch (error) {
                alert('Error al eliminar el video');
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

    // SI está activada, cortamos el array. SI NO, mostramos todo.
    const currentVideos = paginationEnabled
        ? videos.slice(indexOfFirstItem, indexOfLastItem)
        : videos;

    const totalPages = Math.ceil(videos.length / ITEMS_PER_PAGE);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <Link
                    to="/add?type=video"
                    className="w-full md:w-auto flex items-center justify-center bg-gruv-aqua text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-gruv-green transition-transform hover:scale-105 shadow-lg"
                >
                    <Plus className="mr-2" /> Add a Video
                </Link>

                {/* CONTROLES */}
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
                {currentVideos.map((video) => (
                    <ItemCard
                        key={video.id}
                        id={video.id}
                        type="video"
                        thumbnail={`http://localhost:3000/uploads/${video.thumbnail}`}
                        title={video.title}
                        link={video.link}
                        categories={video.Categories?.map((c) => c.name) || []}
                        onDelete={() => handleDelete(video.id)}
                    />
                ))}
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
                Mostrando {currentVideos.length} de {videos.length} videos
                {paginationEnabled
                    ? ` (Página ${currentPage})`
                    : ' (Vista Completa)'}
                .
            </p>

            {/* SOLO MOSTRAR PAGINACIÓN SI ESTÁ ACTIVADA Y HAY MÁS DE 1 PÁGINA */}
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
