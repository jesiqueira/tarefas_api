// src/middlewares/AuthMiddleware.mjs

import jwt from 'jsonwebtoken'
import 'dotenv/config' // Garante que o process.env.JWT_SECRET esteja carregado

// Garantimos que o JWT_SECRET seja carregado. Se estiver undefined, usamos um fallback (má prática em prod!)
const JWT_SECRET = process.env.JWT_SECRET || 'chave_de_dev_insegura_temporaria'

/**
 * Middleware para verificar e decodificar o Token JWT.
 * É usado para proteger rotas.
 *
 * @param {import('express').Request} req - Objeto de requisição do Express.
 * @param {import('express').Response} res - Objeto de resposta do Express.
 * @param {import('express').NextFunction} next - Função para passar para o próximo middleware/controller.
 */
export const authMiddleware = (req, res, next) => {
  // 1. Receber o Token do Header (Bearer <token>)
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      error: 'Token não fornecido. Acesso negado.',
    })
  }

  const [scheme, token] = authHeader.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({
      error: 'Formato do token inválido. Use: Authorization: Bearer <token>',
    })
  }

  // 2. Verificar e Decodificar o Token
  try {
    // jwt.verify() verifica a validade da assinatura e a expiração.
    const decoded = jwt.verify(token, JWT_SECRET)

    // 3. Anexar os dados do usuário à requisição (req) para uso nos Controllers/Services
    // Note: O objeto 'decoded' contém o payload (id e email) que você definiu no Service.
    req.usuario = {
      id: decoded.id, // ID do usuário autenticado (chave primária)
      email: decoded.email, // Email do usuário autenticado
    }

    // Continua para o Controller
    return next()
  } catch (err) {
    // Erro na verificação (token expirado, assinatura incorreta, etc.)
    return res.status(401).json({
      error: 'Token inválido ou expirado.',
    })
  }
}

// Exporta a função diretamente
export default authMiddleware
