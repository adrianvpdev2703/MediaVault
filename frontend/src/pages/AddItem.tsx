import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { X, Plus } from 'lucide-react'; // Iconos para las etiquetas
import { createBook, getBookById, updateBook } from '../api/books';
import { createVideo, getVideoById, updateVideo } from '../api/videos';
import { getAllCategories } from '../api/category';

export default function AddItem() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const type = searchParams.get('type') || 'book';
    const isEditing = Boolean(id);

    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState('');
    const [availableCategories, setAvailableCategories] = useState<
        { id: number; name: string }[]
    >([]);

    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        fetchCategories();

        if (isEditing && id) {
            if (type === 'book') loadBookData(id);
            else if (type === 'video') loadVideoData(id);
        }
    }, [isEditing, id, type]);

    const fetchCategories = async () => {
        try {
            const cats = await getAllCategories();
            setAvailableCategories(cats);
        } catch (error) {
            console.error('Error cargando categorías', error);
        }
    };

    const loadBookData = async (bookId: string) => {
        try {
            const data = await getBookById(bookId);
            setTitle(data.title);
            setLink(data.link);
            if (data.Categories) {
                setSelectedCategories(data.Categories.map((c: any) => c.name));
            }
            setPreview(`http://localhost:3000/uploads/${data.cover}`);
        } catch (error) {
            console.error('Error cargando libro', error);
        }
    };

    const loadVideoData = async (videoId: string) => {
        try {
            const data = await getVideoById(videoId);
            setTitle(data.title);
            setLink(data.link);
            if (data.Categories) {
                setSelectedCategories(data.Categories.map((c: any) => c.name));
            }
            setPreview(`http://localhost:3000/uploads/${data.thumbnail}`);
        } catch (error) {
            console.error('Error cargando video', error);
        }
    };

    const addCategory = (name: string) => {
        const trimmedName = name.trim();

        if (trimmedName && !selectedCategories.includes(trimmedName)) {
            setSelectedCategories([...selectedCategories, trimmedName]);
        }
        setCategoryInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addCategory(categoryInput);
        }
    };

    const removeCategory = (nameToRemove: string) => {
        setSelectedCategories(
            selectedCategories.filter((c) => c !== nameToRemove),
        );
    };

    const suggestions = availableCategories.filter(
        (c) =>
            c.name.toLowerCase().includes(categoryInput.toLowerCase()) &&
            !selectedCategories.includes(c.name),
    );

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selected = e.target.files[0];
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let finalCategories = [...selectedCategories];
        if (
            categoryInput.trim() &&
            !finalCategories.includes(categoryInput.trim())
        ) {
            finalCategories.push(categoryInput.trim());
        }

        if (finalCategories.length === 0)
            return alert('Debes agregar al menos una categoría');

        if (!isEditing && !file)
            return alert('La portada es obligatoria al crear');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('link', link);
        formData.append('categories', finalCategories.join(', '));

        if (file) formData.append('cover', file);

        try {
            if (type === 'book') {
                if (isEditing && id) await updateBook(id, formData);
                else await createBook(formData);
                navigate('/books');
            } else {
                if (isEditing && id) await updateVideo(id, formData);
                else await createVideo(formData);
                navigate('/');
            }
        } catch (error: any) {
            console.error(error);
            alert(
                'Error al guardar: ' +
                    (error.response?.data?.error || error.message),
            );
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-in">
            <div className="flex items-center justify-center">
                <div className="bg-gruv-dark border border-gruv-aqua rounded-lg h-[350px] w-full max-w-[450px] flex items-center justify-center text-gruv-green overflow-hidden relative shadow-lg">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>Selecciona una imagen</span>
                    )}
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 text-gruv-green"
            >
                <h2 className="text-3xl font-bold text-gruv-yellow capitalize flex items-center gap-2">
                    {isEditing ? <PencilIcon /> : <PlusIcon />}
                    {isEditing ? 'Edit' : 'Add New'} {type}
                </h2>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gruv-aqua uppercase tracking-wider">
                        Título
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded bg-black/20 border border-gray-600 focus:border-gruv-aqua focus:outline-none text-white transition-colors"
                        required
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gruv-aqua uppercase tracking-wider">
                        Enlace
                    </label>
                    <input
                        type="text"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="w-full p-3 rounded bg-black/20 border border-gray-600 focus:border-gruv-aqua focus:outline-none text-white transition-colors"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gruv-aqua uppercase tracking-wider">
                        Categorías
                    </label>

                    <div className="p-3 rounded bg-black/20 border border-gray-600 focus-within:border-gruv-aqua transition-colors min-h-[50px] flex flex-wrap gap-2 relative">
                        {selectedCategories.map((cat, idx) => (
                            <span
                                key={idx}
                                className="bg-gruv-aqua text-white px-2 py-1 rounded-md text-sm flex items-center gap-1 animate-scale-in"
                            >
                                {cat}
                                <button
                                    type="button"
                                    onClick={() => removeCategory(cat)}
                                    className="hover:bg-white/20 rounded-full p-0.5"
                                >
                                    <X size={14} />
                                </button>
                            </span>
                        ))}

                        <input
                            type="text"
                            placeholder={
                                selectedCategories.length === 0
                                    ? 'Escribe o selecciona...'
                                    : ''
                            }
                            value={categoryInput}
                            onChange={(e) => setCategoryInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="bg-transparent outline-none flex-1 text-white min-w-[120px]"
                        />

                        {categoryInput && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-gruv-dark border border-gray-600 rounded-lg shadow-xl z-10 max-h-[200px] overflow-y-auto">
                                {suggestions.map((cat) => (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => addCategory(cat.name)}
                                        className="w-full text-left px-4 py-2 hover:bg-gruv-aqua hover:text-white text-gray-300 transition-colors border-b border-gray-700/50 last:border-0"
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-500">
                        Presiona Enter para agregar una nueva o selecciona de la
                        lista.
                    </p>
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-gruv-yellow uppercase tracking-wider">
                        {isEditing ? 'Cambiar portada' : 'Portada'}
                    </label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/*"
                        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gruv-aqua file:text-white hover:file:bg-gruv-green cursor-pointer"
                    />
                </div>

                <button className="bg-gruv-aqua text-white py-3 rounded-lg font-bold hover:bg-gruv-green mt-4 transition-all hover:scale-[1.02] shadow-lg">
                    {isEditing ? 'Guardar Cambios' : 'Crear Item'}
                </button>
            </form>
        </div>
    );
}

const PlusIcon = () => <Plus className="inline mr-2" />;
const PencilIcon = () => (
    <div className="inline mr-2">
        <X className="rotate-45" />
    </div>
);
