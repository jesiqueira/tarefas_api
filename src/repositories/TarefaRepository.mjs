// src/repositories/TarefaRepository.mjs

// Importa o objeto central 'db' que contém todos os Models e a conexão
import db from '../models/index.js'

/**
 * @class TarefaRepository
 * * Responsável pela comunicação direta com o banco de dados
 * através do Model Tarefa do Sequelize.
 * * Abstrai operações de CRUD básicas (Create, Read, Update, Delete)
 * e retorna dados prontos para a camada Service.
 * Não contém lógica de negócio.
 */

class TarefaRepository {
  /**
   * Construtor para Injeção de Dependência.
   * Em produção, usa db.Tarefa; em testes, aceita um Model mockado.
   * @param {Object} model - O Model Sequelize da Tarefa.
   */
  constructor(model = db.Tarefa) {
    this.model = model
  }

  /**
   * Cria um novo registro de tarefa no banco de dados.
   * @param {Object} tarefaData - Dados completos da tarefa (incluindo usuarioId).
   * @returns {Promise<Object>} O objeto Model do Sequelize recém-criado.
   */
  async create(tarefaData) {
    return this.model.create(tarefaData)
  }

  /**
   * Busca todas as tarefas de um usuário específico.
   * @param {number} usuarioId - O ID do usuário.
   * @returns {Promise<Tarefa[]>} Array de objetos Model do Sequelize.
   */
  async findByUsuarioId(usuarioId) {
    return this.model.findAll({ where: { usuarioId } })
  }

  /**
   * Busca uma tarefa pelo ID e garante que ela pertence ao usuário.
   * ESSENCIAL para segurança e posse.
   * @param {number} id - O ID da tarefa.
   * @param {number} usuarioId - O ID do usuário logado.
   * @returns {Promise<Tarefa|null>} O objeto Model do Sequelize, ou null se não for encontrada ou não pertencer ao usuário.
   */
  async findByIdAndUserId(id, usuarioId) {
    return this.model.findOne({ where: { id, usuarioId } })
  }

  /**
   * Atualiza uma tarefa existente, garantindo a posse.
   * @param {number} id - O ID da tarefa a ser atualizado.
   * @param {number} usuarioId - O ID do usuário logado (para segurança).
   * @param {Object} updateData - Dados a serem atualizados.
   * @returns {Promise<number[]>} Array com o número de registros atualizados (ex: [1]).
   */
  async update(id, usuarioId, updateData) {
    // Adiciona o usuarioId ao where para garantir que só o dono possa atualizar
    // NOTA: O Service já garante a posse, mas o Repositório adiciona uma camada de segurança.
    return this.model.update(updateData, { where: { id, usuarioId } })
  }

  /**
   * Deleta uma tarefa pelo ID, garantindo a posse.
   * @param {number} id - O ID da tarefa a ser deletada.
   * @param {number} usuarioId - O ID do usuário logado (para segurança).
   * @returns {Promise<number>} Número de registros deletados (0 ou 1).
   */
  async delete(id, usuarioId) {
    // Adiciona o usuarioId ao where para garantir que só o dono possa deletar
    return this.model.destroy({ where: { id, usuarioId } })
  }
}

// Exporta uma instância da classe para ser usada como Singleton
export default new TarefaRepository()
