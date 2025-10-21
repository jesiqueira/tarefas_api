// src/server.js

// 1. Variáveis de Ambiente e Configuração
import 'dotenv/config'

// 2. Importa a Aplicação Express
import app from './app.js'

// 3. Importa o Banco de Dados (agora importamos o objeto 'db' que contém a conexão Sequelize)
import db from './models/index.js'

const PORT = process.env.PORT || 3000

/**
 * Função principal assíncrona para inicializar a aplicação
 */
async function initializeApp() {
  try {
    // 1. Conectar e testar o DB (Autentica a conexão usando a instância do Sequelize)
    // db.sequelize é a instância que foi exportada do index.js
    await db.sequelize.authenticate()
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!')

    // 2. Sincronizar os models (Cria/atualiza tabelas se não existirem)
    // Use { alter: true } em desenvolvimento para refletir mudanças nos Models.
    await db.sequelize.sync()
    console.log('✅ Banco de dados sincronizado com sucesso!')

    // 3. Iniciar o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
      console.log(`⚙️ Ambiente: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    // O erro aqui captura falhas de autenticação (authenticate) ou sincronização (sync)
    console.error('❌ ERRO DURANTE A INICIALIZAÇÃO DA APLICAÇÃO. Verifique o DB:', error.message)
    process.exit(1)
  }
}

// Inicia a aplicação
initializeApp()

// ⬇️ Tratamento de Erros de Baixo Nível (Boas Práticas)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Encerrando...')
  console.error(err.name, err.message, err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION! Encerrando...')
  console.error('Razão:', reason)
  console.error('Promise:', promise)
  process.exit(1)
})
