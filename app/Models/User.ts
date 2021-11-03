import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
  column,
  beforeSave,
  BaseModel,
  afterFind,
  computed,
  hasOne,
  HasOne,
  afterSave,
} from '@ioc:Adonis/Lucid/Orm'
import discord from 'Config/discord'
import ReactionRolesRule from './ReactionRolesRule'

interface Role {
  id: string
  name: string
}

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public guildId: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public roles: Role[]

  @hasOne(() => ReactionRolesRule)
  public reactionRolesRule: HasOne<typeof ReactionRolesRule>

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @afterSave()
  public static async createReactionRoleRule(user: User) {
    await user.related('reactionRolesRule').create({ message: '' })
  }

  @afterFind()
  public static async fetchRoles(user: User) {
    const guild = await discord.guilds.fetch(user.guildId)
    const roleManager = await guild.roles.fetch()
    const roles = roleManager.cache
      .filter(({ mentionable }) => mentionable === true)
      .map(({ id, name }) => ({ id, name }))

    user.roles = roles
  }
}
