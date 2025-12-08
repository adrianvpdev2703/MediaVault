import { ChevronLeft, ChevronRight } from 'lucide-react';

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
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handleScrollAndChange = (page: number) => {
        onPageChange(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="flex justify-center items-center gap-2 mt-8 py-4 border-t border-gray-700/50">
            <button
                onClick={() => handleScrollAndChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg bg-gray-800 text-gruv-green hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft size={20} />
            </button>

            <div className="flex gap-1 overflow-x-auto pb-1 max-w-[80vw] sm:max-w-none scrollbar-hide">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => handleScrollAndChange(p)}
                        className={`w-10 h-10 rounded-lg font-bold text-sm flex items-center justify-center transition-all ${
                            currentPage === p
                                ? 'bg-gruv-aqua text-white scale-110 shadow-lg'
                                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                        }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button
                onClick={() => handleScrollAndChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg bg-gray-800 text-gruv-green hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
}
