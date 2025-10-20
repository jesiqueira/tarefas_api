// src/models/associations.js
import Usuario from './Usuario.js'
import Tarefa from './Tarefa.js'

// Define a associação entre Usuario e Tarefa
export function setupAssociations() {
  // Define a associação entre Usuario e Tarefa
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
