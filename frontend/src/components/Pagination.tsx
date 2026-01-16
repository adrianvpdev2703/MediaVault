import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';

interface Props {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: Props) {
    // Si solo hay 1 página, no mostramos nada
    if (totalPages <= 1) return null;

    const handleScrollAndChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- LÓGICA DE VENTANA DESLIZANTE ---
    const getPageNumbers = () => {
        const delta = 2; // Cuántos números mostrar a cada lado del actual (2 + 1 + 2 = 5 botones)
        let start = Math.max(1, currentPage - delta);
        let end = Math.min(totalPages, currentPage + delta);

        // Ajuste inteligente: si estamos cerca del inicio, empujamos el final para llenar los 5 huecos
        if (currentPage - delta < 1) {
            end = Math.min(totalPages, end + (1 - (currentPage - delta)));
        }

        // Ajuste inteligente: si estamos cerca del final, empujamos el inicio hacia atrás
        if (currentPage + delta > totalPages) {
            start = Math.max(1, start - (currentPage + delta - totalPages));
        }

        const pages = [];
        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pages = getPageNumbers();

    return (
        <div className="flex flex-wrap justify-center items-center gap-2 mt-8 py-4 border-t border-gray-700/50">
            {/* GRUPO IZQUIERDO: Inicio y Anterior */}
            <div className="flex gap-1">
                <button
                    onClick={() => handleScrollAndChange(1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Ir a la primera página"
                >
                    <ChevronsLeft size={18} />
                </button>
                <button
                    onClick={() => handleScrollAndChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Anterior"
                >
                    <ChevronLeft size={18} />
                </button>
            </div>

            {/* NÚMEROS DE PÁGINA (Ventana deslizante) */}
            <div className="flex gap-1 mx-2">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => handleScrollAndChange(p)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all duration-200 border ${
                            currentPage === p
                                ? 'bg-gruv-aqua text-white border-gruv-aqua shadow-lg scale-105 z-10'
                                : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white hover:border-gray-500'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            {/* GRUPO DERECHO: Siguiente y Final */}
            <div className="flex gap-1">
                <button
                    onClick={() => handleScrollAndChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Siguiente"
                >
                    <ChevronRight size={18} />
                </button>
                <button
                    onClick={() => handleScrollAndChange(totalPages)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title="Ir a la última página"
                >
                    <ChevronsRight size={18} />
                </button>
            </div>
        </div>
    );
}
