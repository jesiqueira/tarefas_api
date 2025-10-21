// src/config/config.mjs
// Este arquivo é para o Sequelize CLI (que espera a estrutura de ambientes)

// Importa a configuração bruta que você já tem
import databaseConfig from './database.js'

// A CLI espera as configurações separadas por ambiente
const cliConfig = {
  // O CLI só precisa das credenciais e do dialeto.
  dialect: databaseConfig.dialect,
  host: databaseConfig.host,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  port: databaseConfig.port,

  // A CLI também precisa do dialectOptions para o SSL em produção
  dialectOptions: databaseConfig.dialectOptions,

  // O CLI IGNORA 'pool' e 'logging', mas você pode mantê-los se o 'databaseConfig' for o objeto exato.
}

// Exporta o formato que o CLI espera
export default {
  development: cliConfig,
  test: cliConfig,
  production: cliConfig,
}
