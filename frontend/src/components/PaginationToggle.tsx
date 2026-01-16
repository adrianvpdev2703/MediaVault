import { FileText, Infinity } from 'lucide-react';

interface Props {
    isEnabled: boolean;
    toggle: () => void;
}

export default function PaginationToggle({ isEnabled, toggle }: Props) {
    return (
        <button
            onClick={toggle}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-700/50 transition-all duration-200 ${
                isEnabled
                    ? 'bg-gruv-aqua/10 text-gruv-aqua border-gruv-aqua/50'
                    : 'bg-gruv-yellow/10 text-gruv-yellow border-gruv-yellow/50'
            }`}
            title={
                isEnabled
                    ? 'Desactivar Paginación (Ver todo)'
                    : 'Activar Paginación'
            }
        >
            {isEnabled ? (
                <>
                    <FileText size={16} />
                    <span className="text-xs font-bold uppercase hidden sm:inline">
                        Paginado
                    </span>
                </>
            ) : (
                <>
                    <Infinity size={16} />
                    <span className="text-xs font-bold uppercase hidden sm:inline">
                        Todo
                    </span>
                </>
            )}
        </button>
    );
}
