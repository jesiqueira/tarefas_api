// src/models/schemas/tarefa.schema.js

// EXPORTAÇÃO DOS VALORES E NOME DO TIPO
export const TAREFA_STATUS_VALUES = ['pendente', 'em_andamento', 'concluida']
export const TAREFA_STATUS_ENUM_NAME = 'enum_tarefas_status'

export const TarefaSchema = (Sequelize) => ({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: true,
  },
  status: {
    type: Sequelize.ENUM(...TAREFA_STATUS_VALUES),
    defaultValue: 'pendente',
  },
  // Apenas o tipo é definido aqui. As referências FK serão adicionadas na Migração.
  usuarioId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
})

export const TAREFA_TABLE_NAME = 'tarefas'
