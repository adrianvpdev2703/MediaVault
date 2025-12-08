const fs = require('fs');
const path = require('path');
const { Book, Video } = require('../models');

const cleanOrphanFiles = async () => {
    const uploadDir = path.join(__dirname, '../../uploads');

    try {
        if (!fs.existsSync(uploadDir)) return;

        const filesInFolder = fs.readdirSync(uploadDir);

        const books = await Book.findAll({ attributes: ['cover'] });
        const videos = await Video.findAll({ attributes: ['thumbnail'] });

        const validFiles = new Set([
            ...books.map((b) => b.cover).filter(Boolean),
            ...videos.map((v) => v.thumbnail).filter(Boolean),
        ]);

        let deletedCount = 0;

        filesInFolder.forEach((file) => {
            if (file.startsWith('.')) return;

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
