# API de Gerenciamento de Tarefas com Arquitetura Modular

Este projeto é uma API RESTful completa para gerenciamento de listas de tarefas (To-Do List), seguindo um rigoroso padrão de design e segurança. 

## ⚙️ Arquitetura e Tecnologia

A API foi construída com **Node.js**, **Express** e **Sequelize (ORM)**, utilizando o padrão **Model-Repository-Service-Controller (M-R-S-C)**. Essa arquitetura garante:
* **Separação de Responsabilidades:** Lógica de negócio isolada na camada de Service.
* **Testabilidade:** Componentes isolados facilitam testes unitários.
* **Manutenibilidade:** Código claro e previsível.

## 🛡️ Segurança e Funcionalidades

* **Autenticação Segura:** Todas as rotas de tarefas são protegidas por **JSON Web Token (JWT)**, gerenciado por um middleware dedicado.
* **Controle de Posse:** Implementação rigorosa de segurança que assegura que um usuário só possa visualizar, atualizar ou deletar *suas próprias* tarefas.
* **Tratamento de Erros:** Respostas formatadas e claras para erros de validação (incluindo valores ENUM inválidos do banco de dados).
* **ES Modules:** Uso de módulos `.mjs` para um ambiente JavaScript moderno.
