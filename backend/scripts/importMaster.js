const { Video, Book, Category, sequelize } = require('../src/models');
const fs = require('fs');

const importMaster = async () => {
    try {
        console.log('🚀 Iniciando restauración en SQLITE...');

        if (!fs.existsSync('MASTER_BACKUP.json')) {
            console.error('❌ No encuentro MASTER_BACKUP.json');
            return;
        }

        const rawData = fs.readFileSync('MASTER_BACKUP.json');
        const backup = JSON.parse(rawData);
        const { videos, books } = backup.data;

        // FORCE: TRUE -> Borra cualquier rastro previo y crea tablas limpias
        await sequelize.sync({ force: true });
        console.log('✨ Base de datos SQLite creada desde cero.');

        // 1. IMPORTAR VIDEOS
        console.log(`🔄 Restaurando ${videos.length} videos...`);
        for (const v of videos) {
            const newVideo = await Video.create({
                title: v.title,
                link: v.link,
                thumbnail: v.thumbnail,
            });

            if (v.categories && v.categories.length > 0) {
                const categoryInstances = [];
                for (const catName of v.categories) {
                    const [cat] = await Category.findOrCreate({
                        where: { name: catName },
                    });
                    categoryInstances.push(cat);
                }
                await newVideo.addCategories(categoryInstances);
            }
        }

        // 2. IMPORTAR LIBROS
        console.log(`🔄 Restaurando ${books.length} libros...`);
        for (const b of books) {
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

        console.log('✅ ¡MIGRACIÓN COMPLETADA!');
        console.log('Ahora tu proyecto corre 100% en local con SQLite.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
};

importMaster();
