require('dotenv').config();
const { Video, Book, Category, sequelize } = require('../src/models');
const fs = require('fs');

const importData = async () => {
    try {
        console.log('🚀 Iniciando migración a MySQL...');

        // 1. Verificar si existe el backup
        if (!fs.existsSync('backup_data.json')) {
            console.error('❌ No se encontró el archivo backup_data.json');
            return;
        }

        const rawData = fs.readFileSync('backup_data.json');
        const backup = JSON.parse(rawData);

        // 2. Sincronizar DB (force: true BORRA y recrea las tablas en MySQL)
        await sequelize.sync({ force: true });
        console.log('✨ Tablas creadas en MySQL (db_videos).');

        // --- IMPORTAR VIDEOS ---
        console.log(`🔄 Importando ${backup.videos.length} videos...`);
        for (const v of backup.videos) {
            const newVideo = await Video.create({
                title: v.title,
                link: v.link,
                thumbnail: v.thumbnail,
            });

            if (v.categories && v.categories.length > 0) {
                const categoryInstances = [];
                // Usamos bucle for...of para asegurar secuencialidad
                for (const catName of v.categories) {
                    const [cat] = await Category.findOrCreate({
                        where: { name: catName },
                    });
                    categoryInstances.push(cat);
                }
                await newVideo.addCategories(categoryInstances);
            }
        }

        // --- IMPORTAR LIBROS ---
        console.log(`🔄 Importando ${backup.books.length} libros...`);
        for (const b of backup.books) {
            const newBook = await Book.create({
                title: b.title,
                link: b.link,
                cover: b.cover,
            });

            if (b.categories && b.categories.length > 0) {
                const categoryInstances = [];
                for (const catName of b.categories) {
                    const [cat] = await Category.findOrCreate({
                        where: { name: catName },
                    });
                    categoryInstances.push(cat);
                }
                await newBook.addCategories(categoryInstances);
            }
        }

        console.log('✅ ¡MIGRACIÓN A MYSQL COMPLETADA!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fatal:', error);
        process.exit(1);
    }
};

importData();
