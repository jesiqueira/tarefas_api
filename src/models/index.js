// src/models/index.js
import connection from '../config/connect.js' // Sua instância Sequelize
import Usuario from './Usuario.js'
import Tarefa from './Tarefa.js'

// 1. Inicializa todos os Models
// Chamando o initialize de cada Model, passando a instância de conexão
Usuario.initialize(connection)
Tarefa.initialize(connection)

// 2. Define a função para configurar as Associações
export function setupAssociations() {
  // 1. Um Usuário tem MUITAS Tarefas
  Usuario.hasMany(Tarefa, {
    foreignKey: 'usuarioId',
    as: 'tarefas',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })

  // 2. Uma Tarefa pertence a UM Usuário
  Tarefa.belongsTo(Usuario, {
    foreignKey: 'usuarioId',
    as: 'usuario',
  })
}

setupAssociations()

// Exporta os Models para serem usados na camada Service
export default {
  Usuario,
  Tarefa,
  sequelize: connection,
}
