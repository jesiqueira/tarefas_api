// src/services/UsuarioService.mjs

import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import 'dotenv/config' // Para process.env.JWT_SECRET e JWT_EXPIRES_IN
import UsuarioRepository from '../repositories/UsuarioRepository.mjs'

// Desestruturação de Objeto para process.env ---
const {
  JWT_SECRET,
  JWT_EXPIRES_IN = '1d', // Definindo default '1d' de forma limpa
} = process.env
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

  /**
   * Autentica um usuário e gera um token JWT.
   * * @param {string} email - Email do usuário.
   * @param {string} senha - Senha em texto simples fornecida pelo usuário.
   * @returns {Promise<{ token: string, usuario: Object }>} Token e dados do usuário (sem a senha).
   * @throws {Error} Se o email ou senha forem inválidos.
   */
  async loginUsuario(email, senha) {
    // 1. Buscar o usuário pelo e-mail
    const usuario = await this.usuarioRepository.findByEmail(email)

    if (!usuario) {
      // Usamos uma mensagem genérica para não dar dicas a invasores
      throw new Error('E-mail ou senha inválidos.')
    }

    // 2. Comparar a senha fornecida com o hash salvo (Lógica de Segurança)
    // No JS, chamamos a coluna de 'senha', mas no DB é 'senha_hash'.
    // O Sequelize retorna o objeto do Model com a chave exata do DB, por isso é seguro usar 'usuario.senha'.
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha)

    if (!senhaCorreta) {
      throw new Error('E-mail ou senha inválidos.')
    }

    // 3. Geração do Token JWT
    const payload = {
      id: usuario.id,
      email: usuario.email,
    }

    const options = {
      expiresIn: JWT_EXPIRES_IN,
    }

    // Assina o token com a chave secreta e define a expiração
    const token = jwt.sign(payload, JWT_SECRET, options)

    // 4. Remover a senha hash do objeto retornado (Segurança)
    const usuarioSimples = usuario.toJSON()

    // O objeto retornado pelo Sequelize usa a chave definida no schema (no seu caso, 'senha').
    // Excluímos a chave 'senha' do objeto
    delete usuarioSimples.senha

    // Retorna o token e os dados do usuário (sem a senha)
    return {
      token,
      usuario: usuarioSimples,
    }
  }
}

// Exporta uma instância da classe para ser usada como Singleton
export default new UsuarioService()
