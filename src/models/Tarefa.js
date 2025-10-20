import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'

class Tarefa extends Model {}

Tarefa.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pendente', 'em andamento', 'concluida'),
      defaultValue: 'pendente',
    },
  },
  {
    sequelize,
    modelName: 'Tarefa',
    tableName: 'tarefas',
    timestamps: false,
  },
)

export default Tarefa
