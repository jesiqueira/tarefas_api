// src/services/TarefaService.mjs
import TarefaRepository from '../repositories/TarefaRepository.mjs'

/**
 * @class TarefaService
 * * Responsável por implementar a lógica de negócio (Regras de Tarefa).
 * * Utiliza o TarefaRepository para acessar o banco de dados.
 */

class TarefaService {
  /**
   * Construtor que injeta o Repositório (Dependência Injetada).
   * Isso facilita a testabilidade (Mocks) e a modularidade.
   * @param {TarefaRepository} repository - Repositório injetado.
   */
  constructor(repository = TarefaRepository) {
    this.tarefaRepository = repository
  }

  /**
   * Cria uma nova tarefa na aplicação.
   * @param {Object} tarefaData - Dados brutos da tarefa (titulo, descricao, etc.).
   * @param {number} usuarioId - ID do usuário autenticado (obtido via JWT).
   * @returns {Promise<Object>} O objeto da tarefa criada.
   */
  async criarTarefa(tarefaData, usuarioId) {
    // 1. Lógica de Negócio: Garante que o título esteja presente
    if (!tarefaData.titulo || tarefaData.titulo.trim() === '') {
      throw new Error('O título da tarefa é obrigatório.')
    }

    // 2. INJEÇÃO DE SEGURANÇA: Junta os dados da tarefa com o ID do usuário autenticado
    const dadosComUsuarioId = { ...tarefaData, usuarioId }

    // Delega a operação de DB ao Repositório (Retorno direto de Promise)
    return this.tarefaRepository.create(dadosComUsuarioId)
  }

  /**
   * Listar todas as tarefas de um usuário específico.
   *
   * @param {number} usuarioId - ID do usuário.
   * @returns {Promise<Array>} Lista de tarefas do usuário.
   */
  async listarTarefas(usuarioId) {
    // Retorno direto da Promise (não precisa de 'await')
    return this.tarefaRepository.findByUsuarioId(usuarioId)
  }

  /**
   * Busca uma tarefa e garante que ela pertence ao usuário logado, usando o método findByIdAndUserId.
   * Lança um erro se não for encontrada ou se o usuário não for o dono.
   * @param {number} tarefaId - ID da tarefa.
   * @param {number} usuarioId - ID do usuário autenticado.
   * @returns {Promise<Object>} A tarefa encontrada.
   */
  async buscarTarefaVerificarPosse(tarefaId, usuarioId) {
    // Usa o novo método de segurança do Repositório
    const tarefa = await this.tarefaRepository.findByIdAndUserId(tarefaId, usuarioId)

    if (!tarefa) {
      // Usamos uma mensagem genérica para não revelar que a tarefa existe para outros usuários.
      throw new Error('Tarefa não encontrada ou acesso negado.')
    }
    return tarefa
  }

  /**
   * Atualiza uma tarefa existente.
   * @param {number} tarefaId - ID da tarefa a ser atualizada.
   * @param {number} usuarioId - ID do usuário autenticado (para verificação de posse).
   * @param {Object} tarefaData - Dados a serem atualizados.
   * @returns {Promise<number>} Número de registros atualizados (0 ou 1).
   */
  async atualizarTarefa(tarefaId, usuarioId, tarefaData) {
    // 1. Verifica se a tarefa existe e pertence ao usuário (lança erro se não)
    await this.buscarTarefaVerificarPosse(tarefaId, usuarioId)

    // 2. Delega a atualização ao repositório, passando o usuarioId para o WHERE
    const [registrosAtualizados] = await this.tarefaRepository.update(tarefaId, usuarioId, tarefaData)

    // Retorna a quantidade de registros atualizados
    return registrosAtualizados
  }

  /**
   * Deleta uma tarefa pelo ID.
   * @param {number} tarefaId - ID da tarefa a ser deletada.
   * @param {number} usuarioId - ID do usuário autenticado.
   * @returns {Promise<number>} Número de registros deletados (0 ou 1).
   */
  async deletarTarefa(tarefaId, usuarioId) {
    // 1. Verifica se a tarefa existe e pertence ao usuário (lança erro se não)
    await this.buscarTarefaVerificarPosse(tarefaId, usuarioId)

    // 2. Delega a deleção ao repositório, passando o usuarioId para o WHERE
    const resultado = await this.tarefaRepository.delete(tarefaId, usuarioId)

    return resultado
  }
}

// Exporta uma instância da classe para ser usada como Singleton
export default new TarefaService()
