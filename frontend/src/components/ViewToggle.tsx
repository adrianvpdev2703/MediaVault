interface Props {
    columns: number;
    setColumns: (cols: number) => void;
}

export default function ViewToggle({ columns, setColumns }: Props) {
    const options = [3, 4, 6, 8];

    return (
        <div className="flex items-center gap-2 bg-black/20 p-1 rounded-lg border border-gray-700/50 h-fit">
            <span className="text-xs text-gray-500 font-bold px-2 uppercase hidden sm:block">
                Vista:
            </span>
            {options.map((opt) => (
                <button
                    key={opt}
                    onClick={() => setColumns(opt)}
                    className={`px-3 py-1.5 rounded-md text-sm font-bold transition-all duration-200 ${
                        columns === opt
                            ? 'bg-gruv-aqua text-white shadow-lg scale-105'
                            : 'text-gray-400 hover:text-gruv-green hover:bg-white/5'
                    }`}
                    title={`Ver ${opt} columnas`}
                >
                    {opt}
                </button>
            ))}
        </div>
    );
}
