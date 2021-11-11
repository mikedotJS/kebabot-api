import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import ReactionRole from './ReactionRole'

export default class ReactionRolesRule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column()
  public message: string

  @hasMany(() => ReactionRole)
  public reactionRoles: HasMany<typeof ReactionRole>

  @column()
  public userId: number

  @column()
  public channelId: string

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
