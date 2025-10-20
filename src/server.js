// 1. Variáveis de Ambiente e Configuração
import 'dotenv/config'

// 2. Importa a Aplicação Express
import app from './app.js'

// 3. Importa o Banco de Dados e as Associações
// Importa a instância Sequelize como 'connection' (default export)
// e a função 'connectDatabase' (named export) de src/config/connect.js
import connection, { connectDatabase } from './config/connect.js'
// import './models/associations' // Garante que as associações sejam carregadas

const PORT = process.env.PORT || 3000

/**
 * Função principal assíncrona para inicializar a aplicação
 */
async function initializeApp() {
  try {
    // 1. Conectar e testar o DB (usando sua função de connect.js)
    // O console.log('Conectando...') já está dentro da função connectDatabase,
    // mas mantive a chamada para clareza.
    await connectDatabase()
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso.')

    // 2. Sincronizar os Modelos com o DB
    if (process.env.NODE_ENV === 'development') {
      // Usa 'connection' que é a instância Sequelize importada de connect.js
      await connection.sync({ force: false })
      console.log('✅ Modelos e tabelas sincronizadas!')
    }

    // 3. Iniciar o servidor Express
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
      console.log(`⚙️ Ambiente: ${process.env.NODE_ENV || 'development'}`)
      // console.log(`📄 Docs: http://localhost:${PORT}/docs`)
    })
  } catch (error) {
    // O erro já está sendo tratado dentro de connectDatabase com process.exit(1),
    // mas é bom ter esse bloco para outros erros de inicialização.
    console.error('❌ ERRO DURANTE A INICIALIZAÇÃO DA APLICAÇÃO:', error.message)
    process.exit(1)
  }
}

// Inicia a aplicação
initializeApp()

// ⬇️ Tratamento de Erros de Baixo Nível (Boas Práticas)

// Trata Exceções Síncronas Não Capturadas
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Encerrando...')
  console.error(err.name, err.message, err.stack)
  process.exit(1)
})

// Trata Rejeições de Promises Não Capturadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ UNHANDLED REJECTION! Encerrando...')
  console.error('Razão:', reason)
  console.error('Promise:', promise)
  process.exit(1)
})
