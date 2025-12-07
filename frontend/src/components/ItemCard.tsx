import { useState } from 'react';
import { Clipboard, Check, Pencil, Trash, ExternalLink } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

interface Props {
    id: string | number;
    thumbnail: string;
    title: string;
    link: string;
    categories?: string[];
    type?: 'book' | 'video';
    onDelete?: () => void;
}

export default function ItemCard({
    id,
    thumbnail,
    title,
    link,
    categories = [],
    type = 'book',
    onDelete,
}: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="group relative bg-gruv-dark border border-gray-700/50 rounded-xl overflow-hidden shadow-lg hover:shadow-gruv-aqua/20 transition-all duration-300 hover:-translate-y-1 flex flex-col h-full">
            {/* 1. IMAGEN (Link al detalle) */}
            <RouterLink
                to={`/view/${type}/${id}`}
                className="relative overflow-hidden aspect-video flex-shrink-0 cursor-pointer"
            >
                <img
                    src={thumbnail}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={title}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
            </RouterLink>

            {/* 2. CATEGORÍAS (AHORA SON LINKS DE BÚSQUEDA) */}
            {categories && categories.length > 0 && (
                <div className="px-4 mt-3 flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gruv-aqua/50 scrollbar-track-transparent">
                    {categories.map((cat, index) => (
                        <RouterLink
                            key={index}
                            // Codificamos la URI por si la categoría tiene espacios o tildes
                            to={`/search?q=${encodeURIComponent(cat)}`}
                            onClick={(e) => e.stopPropagation()} // Evita conflictos de click
                            className="whitespace-nowrap px-2 py-1 bg-white/5 border border-white/10 rounded-md text-xs text-gruv-aqua font-medium tracking-wide hover:bg-gruv-aqua hover:text-white hover:border-gruv-aqua transition-all duration-200 cursor-pointer"
                            title={`Buscar todo sobre: ${cat}`}
                        >
                            {cat}
                        </RouterLink>
                    ))}
                </div>
            )}

            {/* 3. CONTENIDO RESTANTE */}
            <div className="px-4 pb-4 pt-2 flex flex-col gap-4 flex-1">
                {/* Título (Link al detalle) */}
                <RouterLink to={`/view/${type}/${id}`}>
                    <h2
                        className="text-xl font-bold text-gruv-yellow line-clamp-1 hover:text-gruv-aqua transition-colors"
                        title={title}
                    >
                        {title}
                    </h2>
                </RouterLink>

                {/* Zona del Link */}
                <div className="mt-auto flex items-center bg-gray-100/90 rounded-md p-1 pl-3 shadow-inner gap-2">
                    <span className="text-sm text-gray-800 truncate font-mono flex-1 select-all">
                        {link}
                    </span>

                    <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md hover:bg-gray-200 text-gray-700 transition-colors relative"
                        title="Copiar al portapapeles"
                    >
                        {copied ? (
                            <Check size={16} className="text-green-600" />
                        ) : (
                            <Clipboard size={16} />
                        )}
                    </button>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-700/50">
                    <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gruv-green hover:text-white text-xs flex items-center gap-1 transition-colors"
                    >
                        <ExternalLink size={12} /> Abrir
                    </a>

                    <div className="flex gap-2">
                        <RouterLink
                            to={`/edit/${id}?type=${type}`}
                            className="p-2 bg-gruv-yellow/10 text-gruv-yellow rounded-lg hover:bg-gruv-yellow hover:text-white transition-all duration-200"
                            title="Editar"
                        >
                            <Pencil size={18} />
                        </RouterLink>

                        <button
                            onClick={onDelete}
                            className="p-2 bg-gruv-red/10 text-gruv-red rounded-lg hover:bg-gruv-red hover:text-white transition-all duration-200"
                            title="Borrar"
                        >
                            <Trash size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
