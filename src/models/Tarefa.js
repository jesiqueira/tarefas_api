// src/models/Tarefa.js
import { Model } from 'sequelize'
import { TarefaSchema, TAREFA_TABLE_NAME } from './schemas/tarefa.schema.js'

class Tarefa extends Model {
  static initialize(sequelize) {
    Tarefa.init(TarefaSchema(sequelize.Sequelize), {
      sequelize,
      modelName: 'Tarefa',
      tableName: TAREFA_TABLE_NAME,
      timestamps: true,
    })
  }
}

export default Tarefa
