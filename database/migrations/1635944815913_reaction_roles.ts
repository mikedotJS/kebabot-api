import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ReactionRoles extends BaseSchema {
  protected tableName = 'reaction_roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table
        .integer('reaction_roles_rule_id')
        .unsigned()
        .references('reaction_roles_rules.id')
        .onDelete('CASCADE')
      table.string('reaction_id')
      table.string('role_discord_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
