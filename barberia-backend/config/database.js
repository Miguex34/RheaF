const { Sequelize } = require('sequelize');
require('dotenv').config(); // Cargar las variables de entorno

// Verificar si existe una URL de conexión directa
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Deshabilitar validación de certificados para Railway
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
      }
    );

module.exports = sequelize;