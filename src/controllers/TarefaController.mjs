// src/controllers/TarefaController.mjs

import TarefaService from '../services/TarefaService.mjs'

/**
 * @class TarefaController
 * Responsável por gerenciar as requisições HTTP para a entidade Tarefa.
 * Lida com entrada (req.body, req.params), extrai o ID do usuário (req.usuario.id)
 * e delega a lógica ao Service.
 */
class TarefaController {
  constructor(service = TarefaService) {
    this.tarefaService = service
  }

  /**
   * Helper para formatar erros de validação do Sequelize e erros de ENUM de nível DB.
   */
  _handleSequelizeValidation(error, res) {
    // 1. Tratamento para erros de ENUM de nível de Banco de Dados (PostgreSQL/DatabaseError)
    // O erro do DB geralmente tem a mensagem "invalid input value for enum..."
    if (error.message && error.message.includes('invalid input value for enum')) {
      // Assume os valores permitidos para a Tarefa Status (você pode carregar isso de um arquivo de constantes se for complexo)
      const allowedValues = ['pendente', 'em_andamento', 'concluida'].join(', ')

      // Tenta extrair o nome do campo da string do erro do DB (ex: enum_tarefas_status)
      const fieldNameMatch = error.message.match(/enum_tarefas_([a-zA-Z_]+)/)
      const fieldName = fieldNameMatch ? fieldNameMatch[1].replace('_', ' ') : 'status'

      return res.status(400).json({
        error: `Valor inválido para o campo '${fieldName}'. Os valores permitidos são: ${allowedValues}.`,
      })
    }

    // 2. Tratamento para erros de validação do Sequelize (nível de modelo)
    if (error.name === 'SequelizeValidationError' && error.errors && error.errors.length > 0) {
      const firstError = error.errors[0]
      let { message } = firstError

      // Tenta extrair valores permitidos para erro ENUM de modelo (validatorKey 'isIn')
      if (firstError.validatorKey === 'isIn') {
        const match = firstError.message.match(/'([^']*)'/g)
        // Valores de fallback se a regex falhar, mas o erro de validação do modelo geralmente é mais confiável.
        const allowedValues = match ? match.map((m) => m.replace(/'/g, '')) : ['pendente', 'em_andamento', 'concluida']
        const allowedList = allowedValues.join(', ')

        message = `Valor inválido para o campo '${firstError.path}'. Os valores permitidos são: ${allowedList}.`
      }

      return res.status(400).json({
        error: `Erro de validação: ${message}`,
      })
    }

    // 3. Lida com erros de lógica de negócio (ex: título obrigatório lançado pelo Service)
    if (error.message.includes('obrigatório')) {
      return res.status(400).json({ error: error.message })
    }

    // 4. Erro genérico
    console.error('Erro de validação não capturado:', error)
    return res.status(500).json({
      error: error.message || 'Erro interno do servidor durante a validação.',
    })
  }

  /**
   * Endpoint para criar uma nova tarefa (POST /tarefas).
   */
  async criarTarefa(req, res) {
    const { titulo, descricao, status } = req.body
    // Pegamos o ID do usuário do objeto 'req.usuario' injetado pelo Middleware!
    const usuarioId = req.usuario.id

    try {
      const novaTarefa = await this.tarefaService.criarTarefa({ titulo, descricao, status }, usuarioId)

      return res.status(201).json(novaTarefa)
    } catch (error) {
      return this._handleSequelizeValidation(error, res)
    }
  }

  /**
   * Endpoint para listar todas as tarefas de um usuário (GET /tarefas).
   */
  async listarTarefas(req, res) {
    // Pegamos o ID do usuário do objeto 'req.usuario' injetado pelo Middleware!
    const usuarioId = req.usuario.id

    try {
      const tarefas = await this.tarefaService.listarTarefas(usuarioId)
      return res.status(200).json(tarefas)
    } catch (error) {
      console.error('Erro ao listar tarefas:', error)
      return res.status(500).json({
        error: error.message || 'Erro interno ao listar as tarefas.',
      })
    }
  }

  /**
   * Endpoint para buscar uma única tarefa (GET /tarefas/:id).
   */
  async buscarTarefa(req, res) {
    const { id } = req.params
    // Pegamos o ID do usuário do objeto 'req.usuario' injetado pelo Middleware!
    const usuarioId = req.usuario.id

    try {
      const tarefa = await this.tarefaService.buscarTarefaVerificarPosse(Number(id), usuarioId)

      return res.status(200).json(tarefa)
    } catch (error) {
      if (error.message.includes('Tarefa não encontrada')) {
        return res.status(404).json({ error: error.message })
      }
      console.error('Erro ao buscar tarefa:', error)
      return res.status(500).json({
        error: error.message || 'Erro interno ao buscar a tarefa.',
      })
    }
  }

  /**
   * Endpoint para atualizar uma tarefa (PUT /tarefas/:id).
   */
  async atualizarTarefa(req, res) {
    const { id } = req.params
    // Pegamos o ID do usuário do objeto 'req.usuario' injetado pelo Middleware!
    const usuarioId = req.usuario.id
    const updateData = req.body

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado fornecido para atualização.' })
    }

    try {
      const resultado = await this.tarefaService.atualizarTarefa(Number(id), usuarioId, updateData)

      if (resultado > 0) {
        // Busca o item atualizado para retorno
        const tarefaAtualizada = await this.tarefaService.buscarTarefaVerificarPosse(Number(id), usuarioId)
        return res.status(200).json({
          message: 'Tarefa atualizada com sucesso.',
          tarefa: tarefaAtualizada,
        })
      }

      return res.status(304).json({ message: 'Tarefa não modificada (dados idênticos ou ID inexistente).' })
    } catch (error) {
      if (error.message.includes('Tarefa não encontrada')) {
        return res.status(404).json({ error: error.message })
      }
      return this._handleSequelizeValidation(error, res)
    }
  }

  /**
   * Endpoint para deletar uma tarefa (DELETE /tarefas/:id).
   */
  async deletarTarefa(req, res) {
    const { id } = req.params
    // Pegamos o ID do usuário do objeto 'req.usuario' injetado pelo Middleware!
    const usuarioId = req.usuario.id

    try {
      const resultado = await this.tarefaService.deletarTarefa(Number(id), usuarioId)

      if (resultado > 0) {
        return res.status(204).send() // 204 No Content para deleção bem-sucedida
      }

      return res.status(404).json({ error: 'Tarefa não encontrada para o usuário.' })
    } catch (error) {
      if (error.message.includes('Tarefa não encontrada')) {
        return res.status(404).json({ error: error.message })
      }
      console.error('Erro ao deletar tarefa:', error)
      return res.status(500).json({
        error: error.message || 'Erro interno ao deletar a tarefa.',
      })
    }
  }
}

// Exporta uma instância da classe para ser usada nas rotas
export default new TarefaController()
