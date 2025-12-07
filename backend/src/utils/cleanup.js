const fs = require('fs');
const path = require('path');
const { Book, Video } = require('../models');

const cleanOrphanFiles = async () => {
    const uploadDir = path.join(__dirname, '../../uploads');

    try {
        // 1. Obtener todos los archivos físicos en la carpeta uploads
        // Si la carpeta no existe, salimos
        if (!fs.existsSync(uploadDir)) return;

        const filesInFolder = fs.readdirSync(uploadDir);

        // 2. Obtener todos los nombres de archivos registrados en la DB
        const books = await Book.findAll({ attributes: ['cover'] });
        const videos = await Video.findAll({ attributes: ['thumbnail'] });

        // Creamos un Set (lista única) con todos los nombres válidos
        const validFiles = new Set([
            ...books.map((b) => b.cover).filter(Boolean), // Filtramos nulos por seguridad
            ...videos.map((v) => v.thumbnail).filter(Boolean),
        ]);

        // 3. Comparar y borrar
        let deletedCount = 0;

        filesInFolder.forEach((file) => {
            // Ignoramos archivos ocultos o de sistema (ej: .gitkeep)
            if (file.startsWith('.')) return;

            // Si el archivo NO está en la lista de válidos, es huérfano
            if (!validFiles.has(file)) {
                const filePath = path.join(uploadDir, file);
                fs.unlinkSync(filePath); // Borrado físico
                console.log(`🗑️ Archivo huérfano eliminado: ${file}`);
                deletedCount++;
            }
        });

        if (deletedCount > 0) {
            console.log(
                `✨ Limpieza completada: ${deletedCount} archivos eliminados.`,
            );
        } else {
            console.log(
                '✅ Carpeta uploads limpia (no se encontraron archivos huérfanos).',
            );
        }
    } catch (error) {
        console.error('Error durante la limpieza de archivos:', error);
    }
};

module.exports = cleanOrphanFiles;
