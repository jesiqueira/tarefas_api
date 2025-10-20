// src/config/connect.js

import { Sequelize } from 'sequelize'
import databaseConfig from './database.js'

// Crie a instância do Sequelize usando o arquivo de configuração
const connection = new Sequelize(databaseConfig)

// Função para testar a conexão com o banco de dados
export async function connectDatabase() {
  try {
    // 💡 PASSA UM OBJETO DE OPÇÕES COM logging: false
    // Isso suprime o 'SELECT 1+1 AS result' desta chamada específica
    await connection.authenticate({ logging: false })
    // console.log('✅ Conexão com o banco de dados estabelecida com sucesso.')
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados. Verifique suas credenciais no .env')
    // Loga o erro detalhado e encerra a aplicação
    console.error(error.message)
    process.exit(1)
  }
}

// Exporta a instância para ser usada na inicialização dos Models
export default connection
