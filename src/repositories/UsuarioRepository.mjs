// src/repositories/UsuarioRepository.mjs

// Importa o objeto central 'db' que contém todos os Models e a conexão
import db from '../models/index.js'

/**
 * @class UsuarioRepository
 * * Responsável pela comunicação direta com o banco de dados
 * através do Model Usuario do Sequelize.
 * * Abstrai operações de CRUD básicas (Create, Read, Update, Delete).
 */

class UsuarioRepository {
  /**
   * Construtor para Injeção de Dependência.
   * Em produção, usa db.Usuario; em testes, aceita um Model mockado.
   */
  constructor(model = db.Usuario) {
    this.model = model
  }

  /**
   * Cria um novo registro de usuário no banco de dados.
   * @param {Object} userData - Dados do usuário a serem criados.
   * @returns {Promise<Usuario>} O objeto Model do Sequelize recém-criado.
   */
  async create(userData) {
    // Usa this.model (o Model injetado)
    return this.model.create(userData)
  }

  /**
   * Busca um usuário pelo ID.
   * @param {number} id - O ID do usuário.
   * @returns {Promise<Usuario|null>} O objeto Model do Sequelize, ou null se não encontrado.
   */
  async findById(id) {
    return this.model.findByPk(id)
  }

  /**
   * Buscar um usuário pelo email.
   * @param {string} email - O email do usuário.
   * @returns {Promise<Usuario|null>} O objeto Model do Sequelize, ou null se não encontrado.
   */
  async findByEmail(email) {
    return this.model.findOne({ where: { email } })
  }

  /**
   * Buscar todos os usuários.
   * @returns {Promise<Usuario[]>} Array de objetos Model do Sequelize.
   */
  async findAll() {
    return this.model.findAll()
  }

  /**
   * Atualiza um usuário existente.
   * @param {number} id - O ID do usuário a ser atualizado.
   * @param {Object} updateData - Dados a serem atualizados.
   * @returns {Promise<number>} Número de registros atualizados (0 ou 1).
   */
  async update(id, updateData) {
    return this.model.update(updateData, { where: { id } })
  }

  /**
   * Deleta um usuário pelo ID.
   * @param {number} id - O ID do usuário a ser deletado.
   * @returns {Promise<number>} Número de registros deletados (0 ou 1).
   */
  async delete(id) {
    return this.model.destroy({ where: { id } })
  }
}

// Exporta uma instância da classe para ser usada como Singleton
export default new UsuarioRepository()
