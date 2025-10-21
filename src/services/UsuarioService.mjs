// src/services/UsuarioService.mjs

import bcrypt from 'bcryptjs'
import UsuarioRepository from '../repositories/UsuarioRepository.mjs'

const HASH_SALT_ROUNDS = 10 // Padrão de segurança para o hashing da senha

/**
 * @class UsuarioService
 * * Responsável por implementar a lógica de negócio (Regras de Usuário).
 * * Utiliza o UsuarioRepository para acessar o banco de dados.
 */
class UsuarioService {
  /**
   * Construtor que injeta o Repositório (Dependência Injetada).
   * Isso facilita a testabilidade (Mocks) e a modularidade.
   */
  constructor(repository = UsuarioRepository) {
    this.usuarioRepository = repository
  }

  /**
   * Registra um novo usuário na aplicação.
   * Aplica regras de negócio: verifica duplicidade de email e criptografa a senha.
   *
   * @param {Object} userData - Dados brutos do usuário (inclui email e senha plain text).
   * @returns {Promise<Object>} O objeto do usuário (sem a senha).
   * @throws {Error} Se o email já estiver em uso.
   */
  async criarUsuario(userData) {
    // 1. Regra de Negócio: Verificar se o email já existe
    const usuarioExistente = await this.usuarioRepository.findByEmail(userData.email)

    if (usuarioExistente) {
      throw new Error('O email fornecido já está em uso.')
    }

    // 2. Regra de Negócio: Criptografar a senha antes de salvar
    const senhaHash = await bcrypt.hash(userData.senha, HASH_SALT_ROUNDS)

    // 3. Preparar os dados para o Repositório
    const dadosParaCriar = {
      ...userData,
      senha: senhaHash, // Salva o hash, não a senha em texto claro
    }

    // 4. Delega a operação de DB ao Repositório
    const novoUsuario = await this.usuarioRepository.create(dadosParaCriar)

    // 5. Retorno: Remove a senha antes de enviar para o Controller
    // (Geralmente o Sequelize retorna o objeto com a senha, então removemos aqui por segurança)
    const usuarioSemSenha = novoUsuario.toJSON()
    delete usuarioSemSenha.senha

    return usuarioSemSenha
  }

  /**
   * Busca um usuário pelo ID.
   * A lógica aqui é simples, apenas delegando para o repositório.
   *
   * @param {number} id - O ID do usuário.
   * @returns {Promise<Object|null>} O objeto do usuário (sem a senha).
   */
  async buscarPorId(id) {
    const usuario = await this.usuarioRepository.findById(id)

    if (!usuario) {
      return null
    }

    const usuarioSemSenha = usuario.toJSON()
    delete usuarioSemSenha.senha

    return usuarioSemSenha
  }
}

// Exporta uma instância da classe para ser usada como Singleton
export default new UsuarioService()
