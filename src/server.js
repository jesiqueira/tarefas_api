// src/server.js

// 1. Variáveis de Ambiente e Configuração
import 'dotenv/config'

// 2. Importa a Aplicação Express
import app from './app.js'

// 3. Importa o Banco de Dados
import { connectDatabase } from './config/connect.js'

const PORT = process.env.PORT || 3000

/**
 * Função principal assíncrona para inicializar a aplicação
 */
async function initializeApp() {
  try {
    // 1. Conectar e testar o DB
    await connectDatabase()

    // 2. Iniciar o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
      console.log(`⚙️ Ambiente: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (error) {
    console.error('❌ ERRO DURANTE A INICIALIZAÇÃO DA APLICAÇÃO:', error.message)
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
