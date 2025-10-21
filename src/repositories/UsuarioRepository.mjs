import { Usuario } from '../models/index.js'

/**
 * @class UsuarioRepository
 * * Responsável pela comunicação direta com o banco de dados
 * através do Model Usuario do Sequelize.
 * * Abstrai operações de CRUD básicas (Create, Read, Update, Delete)
 * e retorna dados prontos para a camada Service.
 */

class UsuarioRepository {
  /**
   * Cria um novo registro de usuário no banco de dados.
   * @param {Object} userData - Dados do usuário a serem criados.
   * @returns {Promise<Usuario>} O objeto Model do Sequelize recém-criado.
   */

  async create(userData) {
    // Apenas chama o método create do Sequelize
    return Usuario.create(userData)
  }

  /**
   * Busca um usuário pelo ID.
   * @param {number} id - O ID do usuário.
   * @returns {Promise<Usuario|null>} O objeto Model do Sequelize, ou null se não encontrado.
   */
  async findById(id) {
    return Usuario.findByPk(id)
  }

  /**
   * Buscar um usuário pelo email.
   * @param {string} email - O email do usuário.
   * @returns {Promise<Usuario|null>} O objeto Model do Sequelize, ou null se não encontrado.
   */
  async findByEmail(email) {
    return Usuario.findOne({ where: { email } })
  }

  /**
   * Buscar todos os usuários.
   * @returns {Promise<Usuario[]>} Array de objetos Model do Sequelize.
   */
  async findAll() {
    return Usuario.findAll()
  }

  /**
   * Atualiza um usuário existente.
   * @param {number} id - O ID do usuário a ser atualizado.
   * @param {Object} updateData - Dados a serem atualizados.
   * @returns {Promise<number>} Número de registros atualizados (0 ou 1).
   */
  async update(id, updateData) {
    return Usuario.update(updateData, { where: { id } })
  }

  /**
   * Deleta um usuário pelo ID.
   * @param {number} id - O ID do usuário a ser deletado.
   * @returns {Promise<number>} Número de registros deletados (0 ou 1).
   */
  async delete(id) {
    return Usuario.destroy({ where: { id } })
  }
}

// Exporta uma instância da classe para ser usada como Singleton
// (garantindo que não criamos múltiplas instâncias desnecessárias)
export default new UsuarioRepository()
