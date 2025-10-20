// src/models/schemas/usuario.schema.js

export const UsuarioSchema = (Sequelize) => ({
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

// Você pode exportar o nome da tabela aqui também para o index.js
export const USUARIO_TABLE_NAME = 'usuarios'
