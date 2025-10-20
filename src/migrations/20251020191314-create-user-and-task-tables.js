// Importa as definições de esquema e nomes de tabelas, incluindo os itens do ENUM
import { UsuarioSchema, USUARIO_TABLE_NAME } from '../models/schemas/usuario.schema.js'
import { TarefaSchema, TAREFA_TABLE_NAME, TAREFA_STATUS_VALUES, TAREFA_STATUS_ENUM_NAME } from '../models/schemas/tarefa.schema.js'

/** @type {import('sequelize-cli').Migration} */
export default {
  // O que fazer quando a migração for executada (UP)
  async up(queryInterface, Sequelize) {
    // ------------------------------------
    // PASSO 1: CRIAR O TIPO ENUM SEPARADAMENTE (PARA O POSTGRES)
    // ------------------------------------
    // A função de join cria a string SQL: 'pendente', 'em andamento', 'concluida'
    const enumQuery = `CREATE TYPE "${TAREFA_STATUS_ENUM_NAME}" AS ENUM ('${TAREFA_STATUS_VALUES.join("', '")}');`
    await queryInterface.sequelize.query(enumQuery)

    // 2. Tabela de Tarefas: Prepara a definição da tabela
    // O spread (...) importa todas as colunas do schema
    const tarefaColumns = {
      ...TarefaSchema(Sequelize),
    }

    // ------------------------------------
    // 3. Tabela de Usuários (Sua Tabela Independente)
    // ------------------------------------
    await queryInterface.createTable(USUARIO_TABLE_NAME, {
      ...UsuarioSchema(Sequelize), // Colunas do schema

      // Colunas Timestamps (Obrigatórias na Migration)
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })

    // ------------------------------------
    // 4. Tabela de Tarefas (Ajuste das Colunas Status e FK)
    // ------------------------------------
    await queryInterface.createTable(TAREFA_TABLE_NAME, {
      // Usa as colunas do schema
      ...tarefaColumns,

      // SOBRESCRITA 1: Coluna 'status' para usar o TIPO ENUM que criamos acima
      status: {
        // Usa o NOME do tipo ENUM criado (string), e não o Sequelize.ENUM
        type: TAREFA_STATUS_ENUM_NAME,
        defaultValue: 'pendente',
      },

      // SOBRESCRITA 2: Coluna 'usuarioId' para definir a Chave Estrangeira (FK)
      usuarioId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: USUARIO_TABLE_NAME, // Tabela que referencia (usuarios)
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      // Timestamps (Obrigatórias na Migration)
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  // O que fazer quando a migração for revertida (DOWN)
  async down(queryInterface) {
    // 1. DROP das Tabelas (dependentes primeiro)
    await queryInterface.dropTable(TAREFA_TABLE_NAME)
    await queryInterface.dropTable(USUARIO_TABLE_NAME)

    // 2. DROP do Tipo ENUM
    await queryInterface.sequelize.query(`DROP TYPE "${TAREFA_STATUS_ENUM_NAME}";`)
  },
}
