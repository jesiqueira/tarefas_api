// src/routes/usuario.routes.mjs

import { Router } from 'express'
import UsuarioController from '../controllers/UsuarioController.mjs'
import authMiddleware from '../middlewares/AuthMiddleware.mjs'

// Cria o router do Express
const router = Router()

// ----------------------------------------------------
// ROTAS PÚBLICAS (NÃO REQUEREM AUTENTICAÇÃO)
// ----------------------------------------------------

// Rota de Registro de novo usuário
// POST /cadastro
router.post('/cadastro', (req, res) => UsuarioController.cadastrarUsuario(req, res))

// Rota de Login
// POST /login
router.post('/login', (req, res) => UsuarioController.loginUsuario(req, res))

// ----------------------------------------------------
// ⬇️ PROTEÇÃO DE ROTAS
// Todas as rotas definidas ABAIXO desta linha usarão o authMiddleware
// ----------------------------------------------------
// O .use() aplica o middleware para todas as rotas subsequentes neste router
router.use(authMiddleware)

// ----------------------------------------------------
// ROTAS PROTEGIDAS PELO JWT
// ----------------------------------------------------

// Rota para buscar/atualizar/deletar o próprio usuário autenticado
// GET /me
// router.get('/me', (req, res) => UsuarioController.buscarDadosDoUsuario(req, res))

// PUT /me
// router.put('/me', (req, res) => UsuarioController.atualizarUsuario(req, res))

// DELETE /me
// router.delete('/me', (req, res) => UsuarioController.deletarUsuario(req, res))

export default router
