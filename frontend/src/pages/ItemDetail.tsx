import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
    ArrowLeft,
    ExternalLink,
    Calendar,
    Pencil,
    Trash,
    Tag,
    Copy,
    Check,
} from 'lucide-react';
import { getBookById, deleteBook } from '../api/books';
import { getVideoById, deleteVideo } from '../api/videos';

interface DetailItem {
    id: number;
    title: string;
    link: string;
    thumbnail: string;
    Categories?: { id: number; name: string }[];
    createdAt?: string;
    updatedAt?: string;
}

export default function ItemDetail() {
    const { type, id } = useParams();
    const navigate = useNavigate();

    const [item, setItem] = useState<DetailItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id || !type) return;
            setLoading(true);
            try {
                let data;
                if (type === 'book') {
                    data = await getBookById(id);
                    data.thumbnail = data.cover;
                } else {
                    data = await getVideoById(id);
                }
                setItem(data);
            } catch (error) {
                console.error('Error cargando detalle', error);
                navigate('/');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id, type, navigate]);

    const handleDelete = async () => {
        if (
            confirm(
                `¿Estás seguro de eliminar este ${
                    type === 'book' ? 'libro' : 'video'
                } permanentemente?`,
            )
        ) {
            try {
                if (type === 'book') await deleteBook(id!);
                else await deleteVideo(id!);
                navigate(type === 'book' ? '/books' : '/');
            } catch (error) {
                alert('Error al eliminar');
            }
        }
    };

    const handleCopyLink = () => {
        if (item?.link) {
            navigator.clipboard.writeText(item.link);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading)
        return (
            <div className="text-center mt-20 text-gray-400 animate-pulse">
                Cargando detalles...
            </div>
        );
    if (!item) return null;

    return (
        <div className="animate-fade-in max-w-6xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-gray-400 hover:text-gruv-aqua transition-colors"
            >
                <ArrowLeft size={20} className="mr-2" /> Volver atrás
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
                {/* COLUMNA IZQUIERDA: IMAGEN */}
                <div className="lg:col-span-3">
                    <div className="relative group rounded-2xl overflow-hidden shadow-2xl border border-gray-700/50 bg-black/20">
                        <img
                            src={`http://localhost:3000/uploads/${item.thumbnail}`}
                            alt={item.title}
                            className="w-full h-auto object-cover max-h-[600px]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-gruv-dark/80 via-transparent to-transparent opacity-60" />
                    </div>
                </div>

                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div>
                        <span className="inline-block px-3 py-1 mb-3 text-xs font-bold tracking-wider uppercase rounded-full bg-white/5 text-gray-400 border border-white/10">
                            {type === 'book' ? 'Libro' : 'Video'}
                        </span>
                        <h1 className="text-3xl md:text-4xl font-bold text-gruv-yellow leading-tight">
                            {item.title}
                        </h1>
                        <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                            <Calendar size={14} />
                            <span>
                                Agregado el{' '}
                                {new Date(
                                    item.createdAt || Date.now(),
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    <hr className="border-gray-700/50" />

                    <div className="flex flex-col gap-3">
                        <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 bg-gruv-aqua text-white py-3 px-6 rounded-lg font-bold hover:bg-gruv-green transition-all shadow-lg hover:shadow-gruv-aqua/20"
                        >
                            <ExternalLink size={20} /> Abrir Enlace Original
                        </a>

                        <div className="flex gap-3">
                            <button
                                onClick={handleCopyLink}
                                className="flex-1 flex items-center justify-center gap-2 bg-gray-700/50 text-gray-200 py-3 rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                            >
                                {copied ? (
                                    <Check
                                        size={18}
                                        className="text-green-400"
                                    />
                                ) : (
                                    <Copy size={18} />
                                )}
                                {copied ? 'Copiado' : 'Copiar Link'}
                            </button>

                            <Link
                                to={`/edit/${item.id}?type=${type}`}
                                className="flex-1 flex items-center justify-center gap-2 bg-gruv-yellow/10 text-gruv-yellow py-3 rounded-lg hover:bg-gruv-yellow hover:text-white transition-colors border border-gruv-yellow/20"
                            >
                                <Pencil size={18} /> Editar
                            </Link>

                            <button
                                onClick={handleDelete}
                                className="px-4 bg-gruv-red/10 text-gruv-red rounded-lg hover:bg-gruv-red hover:text-white transition-colors border border-gruv-red/20"
                                title="Eliminar"
                            >
                                <Trash size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Tag size={14} /> Categorías
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {item.Categories && item.Categories.length > 0 ? (
                                item.Categories.map((cat, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3 py-1.5 bg-gruv-aqua/10 text-gruv-aqua border border-gruv-aqua/20 rounded-md text-sm font-medium"
                                    >
                                        {cat.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-600 italic">
                                    Sin categorías
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-auto pt-6">
                        <div className="bg-black/30 p-3 rounded-lg border border-gray-800 break-all text-xs font-mono text-gray-500">
                            {item.link}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
