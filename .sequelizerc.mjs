import path from 'path'
import { fileURLToPath } from 'url'

// A variável __dirname não existe em módulos ES, por isso precisamos criá-la
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Esta configuração força o Sequelize CLI a procurar e criar arquivos DENTRO da pasta 'src'.
// O CLI é executado usando a flag --module, o que permite o uso de sintaxe ESM aqui.
export default {
  // 1. Onde está o arquivo de configuração de ambientes
  config: path.resolve(__dirname, 'src', 'config', 'config.mjs'),

  // 2. Onde as pastas de desenvolvimento devem ser criadas
  'models-path': path.resolve(__dirname, 'src', 'models'),
  'migrations-path': path.resolve(__dirname, 'src', 'migrations'),
  'seeders-path': path.resolve(__dirname, 'src', 'seeders'),
}
