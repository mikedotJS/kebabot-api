import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import ReactionRolesRule from './ReactionRolesRule'

export default class ReactionRole extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public reactionId: string

  @column()
  public roleDiscordId: string

  @column()
  public reactionRolesRuleId: number

  @column()
  public reactionSymbol: string

  @belongsTo(() => ReactionRolesRule)
  public reactionRolesRule: BelongsTo<typeof ReactionRolesRule>
}
