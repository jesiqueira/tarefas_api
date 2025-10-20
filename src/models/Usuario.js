// src/models/Usuario.js
import { Model } from 'sequelize'
import { UsuarioSchema, USUARIO_TABLE_NAME } from './schemas/usuario.schema.js'

class Usuario extends Model {
  // O método estático move a inicialização para fora do escopo de importação direta
  static initialize(sequelize) {
    Usuario.init(UsuarioSchema(sequelize.Sequelize), {
      sequelize,
      modelName: 'Usuario',
      tableName: USUARIO_TABLE_NAME,
      timestamps: true,
    })
  }
}

export default Usuario
