// src/controllers/UsuarioController.mjs

import UsuarioService from '../services/UsuarioService.mjs'

/**
 * @class UsuarioController
 * Responsável por gerenciar as requisições HTTP para a entidade Usuário.
 * Apenas recebe dados do request, chama o Service e envia a resposta HTTP.
 */
class UsuarioController {
  // O construtor é opcional aqui, mas mantido para consistência e injeção de dependência em testes
  constructor(service = UsuarioService) {
    this.usuarioService = service
  }

  /**
   * Endpoint de Registro de Usuário (POST /usuarios)
   */
  async cadastrarUsuario(req, res) {
    // 1. Usa Destructuring (para satisfazer o ESLint)
    const { nome, email, senha } = req.body

    // Validação básica (opcional, pode ser movida para um middleware de validação Joi/Yup)
    if (!nome || !email || !senha) {
      return res.status(400).json({
        error: 'Nome, email e senha são obrigatórios para o cadastro.',
      })
    }

    try {
      // 2. Chama o Service (Lógica de Negócio: hash de senha, verificação de duplicidade)
      const novoUsuario = await this.usuarioService.criarUsuario({ nome, email, senha })

      // 3. Resposta de Sucesso
      return res.status(201).json(novoUsuario)
    } catch (error) {
      // 4. Tratamento de Erro (Ex: Email duplicado)
      return res.status(400).json({
        error: error.message,
      })
    }
  }

  /**
   * Endpoint de Login de Usuário (POST /login)
   */
  async loginUsuario(req, res) {
    // 1. Usa Destructuring
    const { email, senha } = req.body

    // Validação básica
    if (!email || !senha) {
      return res.status(400).json({
        error: 'Email e senha são obrigatórios para o login.',
      })
    }

    try {
      // 2. Chama o Service (Lógica de Negócio: verificação de senha, geração de JWT)
      const resultado = await this.usuarioService.loginUsuario(email, senha)

      // 3. Resposta de Sucesso (Retorna o token e os dados do usuário)
      // O token é a chave de acesso para as rotas protegidas
      return res.status(200).json(resultado)
    } catch (error) {
      // 4. Tratamento de Erro (Ex: Credenciais inválidas)
      return res.status(401).json({
        error: error.message, // 'E-mail ou senha inválidos.'
      })
    }
  }
}

// Exporta uma instância da classe para ser usada nas rotas
export default new UsuarioController()
