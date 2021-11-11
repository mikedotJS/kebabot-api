import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ReactionRolesRules extends BaseSchema {
  protected tableName = 'reaction_roles_rules'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('channel_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
