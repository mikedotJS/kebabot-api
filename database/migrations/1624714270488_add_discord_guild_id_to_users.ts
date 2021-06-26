import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddDiscordGuildIdToUsers extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable(this.tableName, (table) => {
      table.string('guild_id')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
