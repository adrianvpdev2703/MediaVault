require('dotenv').config();
const { Video, Book, Category } = require('../src/models');
const fs = require('fs');
const path = require('path');

const exportMaster = async () => {
    try {
        console.log('📦 Conectando a MySQL para extraer datos...');

        // 1. Obtener Videos
        const videos = await Video.findAll({
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });

        // 2. Obtener Libros
        const books = await Book.findAll({
            include: [
                {
                    model: Category,
                    through: { attributes: [] },
                },
            ],
        });

        // 3. Limpiar y formatear datos (El formato universal)
        const cleanVideos = videos.map((v) => ({
            title: v.title,
            link: v.link,
            thumbnail: v.thumbnail,
            categories: v.Categories ? v.Categories.map((c) => c.name) : [],
        }));

        const cleanBooks = books.map((b) => ({
            title: b.title,
            link: b.link,
            cover: b.cover,
            categories: b.Categories ? b.Categories.map((c) => c.name) : [],
        }));

        const masterBackup = {
            timestamp: new Date().toISOString(),
            stats: {
                videos: cleanVideos.length,
                books: cleanBooks.length,
            },
            data: {
                videos: cleanVideos,
                books: cleanBooks,
            },
        };

        // 4. Guardar el JSON Maestro
        fs.writeFileSync(
            'MASTER_BACKUP.json',
            JSON.stringify(masterBackup, null, 2),
        );

        console.log(`✅ RESPALDO MAESTRO COMPLETADO`);
        console.log(`📹 Videos: ${cleanVideos.length}`);
        console.log(`📚 Libros: ${cleanBooks.length}`);
        console.log(`📂 Archivo generado: MASTER_BACKUP.json`);
        console.log(`⚠️  GUARDA ESTE ARCHIVO EN TU NUBE AHORA MISMO.`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fatal exportando:', error);
        process.exit(1);
    }
};

exportMaster();
