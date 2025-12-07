const fs = require('fs');
const path = require('path');

const backupDb = () => {
    const dbPath = path.join(__dirname, '../../database.sqlite');
    const backupDir = path.join(__dirname, '../../backups');

    // Si no existe la DB todavía, no hacemos nada
    if (!fs.existsSync(dbPath)) return;

    // Crear carpeta backups si no existe
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    // Nombre del archivo: database-2023-10-27.sqlite
    const date = new Date().toISOString().split('T')[0];
    const backupPath = path.join(backupDir, `database-${date}.sqlite`);

    try {
        fs.copyFileSync(dbPath, backupPath);
        console.log(
            `🛡️ Backup de seguridad creado: backups/database-${date}.sqlite`,
        );

        // Opcional: Borrar backups muy viejos (más de 7 días) para no llenar el disco D
        // ... (podemos agregarlo luego si quieres)
    } catch (error) {
        console.error('Error creando backup:', error);
    }
};

module.exports = backupDb;
