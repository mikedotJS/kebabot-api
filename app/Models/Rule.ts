import { DateTime } from 'luxon';

import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm';

export default class Rule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public reaction: string

  @column()
  public role: string

  @column()
  public userId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
