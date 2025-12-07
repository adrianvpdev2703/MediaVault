require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

// --- OPCIÓN 1: SQLITE (ACTIVA) ---
// Ideal para portabilidad, disco D:, y uso local.
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database.sqlite'), // Se guardará en la raíz del backend
    logging: false,
});

// --- OPCIÓN 2: MYSQL (COMENTADA - RESPALDO) ---
// Usar si necesitas concurrencia masiva o servidor remoto.
/*
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        logging: false,
    },
);
*/

module.exports = sequelize;
