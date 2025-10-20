import express from 'express'
import cors from 'cors'
// import swaggerUi from 'swagger-ui-express'
// import YAML from 'yamljs'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'

// Utilizando fileURLToPath e dirname para recriar o __dirname em ES Modules
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// ⬇️ Carregar o arquivo YAML
// join(__dirname, '..', 'swagger.yaml') -> Vai para 'src/', sobe um nível '..', e pega o arquivo
// const swaggerDocument = YAML.load(join(__dirname, '..', 'swagger.yaml'))

const app = express()

// ⬇️ 1. CONFIGURAÇÃO DO CORS
// Em produção trocar o localhost pelo domínio do front-end ex: https://seufrotend.com.br
const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173']

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
)

// ⬇️ 2. MIDDLEWARE PARA PARSEAR O CORPO DA REQUISIÇÃO (JSON)
app.use(express.json())

// ⬇️ Rota de Documentação
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// ⬇️ Importação e Uso das Rotas (NOTE: O '.js' é obrigatório para arquivos locais no ESM)
// import usuarioRoutes from './routes/usuarioRoutes.js';

// app.use('/api/usuarios', usuarioRoutes);

// Boas Práticas: Middleware 404
app.use((req, res, next) => {
  res.status(404).json({
    message: 'Rota não encontrada.',
    path: req.path,
  })
})

// Boas Práticas: Middleware de tratamento de erro global
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erro interno do servidor',
    },
  })
})

// Exporta a instância do Express
export default app
