require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const routes = require('./src/routes/index');
const cleanOrphanFiles = require('./src/utils/cleanup');
const backupDb = require('./src/utils/backupDb'); // Tu script de backup diario

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

const startServer = async () => {
    try {
        // --- CONFIGURACIÓN PARA SQLITE ---
        // 1. Hacemos backup del archivo .sqlite antes de tocarlo
        // (Asegúrate de tener src/utils/backupDb.js creado como hablamos antes)
        //backupDb();

        // 2. Sincronizamos con alter: false para máxima estabilidad en SQLite
        await sequelize.sync({ alter: false });
        console.log('✅ Conectado a SQLITE (Modo Local)');

        // --- CONFIGURACIÓN PARA MYSQL (COMENTADA) ---
        /*
        await sequelize.sync({ alter: false }); // MySQL soporta alter: true mejor, pero false es más seguro
        console.log('✅ Conectado a MYSQL: db_videos');
        */

        // Limpieza de imágenes huérfanas (funciona igual para ambos)
        await cleanOrphanFiles();

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () =>
            console.log(`🚀 Servidor listo en http://localhost:${PORT}`),
        );
    } catch (error) {
        console.error('❌ Error al iniciar la base de datos:', error);
    }
};

startServer();
