require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const routes = require('./src/routes/index');
const cleanOrphanFiles = require('./src/utils/cleanup');
const backupDb = require('./src/utils/backupDb');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api', routes);

const startServer = async () => {
    try {
        // --- CONFIGURACIÓN PARA SQLITE ---
        //Comentar y descomentar cuando toque hacer backup
        backupDb();

        await sequelize.sync({ alter: false });
        console.log('✅ Conectado a SQLITE (Modo Local)');

        // --- CONFIGURACIÓN PARA MYSQL (COMENTADA) ---
        /*
        await sequelize.sync({ alter: false }); // MySQL soporta alter: true mejor, pero false es más seguro
        console.log('✅ Conectado a MYSQL: db_videos');
        */

        // Limpieza de imágenes huérfanas
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
