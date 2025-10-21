// src/routes/tarefa.routes.mjs

import { Router } from 'express'
import tarefaController from '../controllers/TarefaController.mjs'
// Usando a exportação nomeada que você definiu no seu AuthMiddleware.mjs
import { authMiddleware } from '../middlewares/AuthMiddleware.mjs'

const router = Router()

// =================================================================
// ROTAS PROTEGIDAS POR AUTENTICAÇÃO (CRUD de Tarefas)
// O authMiddleware injeta req.usuario = { id, email }
// =================================================================

// 1. Criar Tarefa (POST /api/tarefas)
// Requer: { titulo, descricao, status }
router.post('/', authMiddleware, (req, res) => tarefaController.criarTarefa(req, res))

// 2. Listar Tarefas do Usuário Logado (GET /api/tarefas)
router.get('/', authMiddleware, (req, res) => tarefaController.listarTarefas(req, res))

// 3. Buscar Tarefa por ID (GET /api/tarefas/:id)
router.get('/:id', authMiddleware, (req, res) => tarefaController.buscarTarefa(req, res))

// 4. Atualizar Tarefa (PUT /api/tarefas/:id)
// Requer: { titulo, status, etc. }
router.put('/:id', authMiddleware, (req, res) => tarefaController.atualizarTarefa(req, res))

// 5. Deletar Tarefa (DELETE /api/tarefas/:id)
router.delete('/:id', authMiddleware, (req, res) => tarefaController.deletarTarefa(req, res))

export default router
