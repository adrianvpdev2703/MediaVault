const fs = require('fs');
const path = require('path');

const backupDb = () => {
    const dbPath = path.join(__dirname, '../../database.sqlite');
    const backupDir = path.join(__dirname, '../../backups');

    if (!fs.existsSync(dbPath)) return;

    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir);
    }

    const date = new Date().toISOString().split('T')[0];
    const backupPath = path.join(backupDir, `database-${date}.sqlite`);

    try {
        fs.copyFileSync(dbPath, backupPath);
        console.log(
            `🛡️ Backup de seguridad creado: backups/database-${date}.sqlite`,
        );
    } catch (error) {
        console.error('Error creando backup:', error);
    }
};

module.exports = backupDb;
