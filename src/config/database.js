// src/config/database.js

import 'dotenv/config' // Garante que as variáveis de ambiente sejam carregadas

// Definição das configurações de conexão do Sequelize para PostgreSQL
const databaseConfig = {
  // Configuração Principal
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 5432,

  // Configurações de pool de conexão
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // Configurações para produção (SSL/TLS)
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production' ? { require: true, rejectUnauthorized: false } : false, // Desativa SSL em desenvolvimento/local
  },

  // Opções de log: mostra logs do SQL em desenvolvimento, oculta em produção
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
}

export default databaseConfig
