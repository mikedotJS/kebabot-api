import User from 'App/Models/User'

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ReactionRolesRule from 'App/Models/ReactionRolesRule'
import ReactionRole from 'App/Models/ReactionRole'

export default class UsersController {
  public async viewer(ctx: HttpContextContract) {
    await ctx.auth.authenticate()

    await ctx.auth.user?.load('reactionRolesRules', (reactionRolesRulesModel) => {
      reactionRolesRulesModel.preload('reactionRoles')
    })

    return ctx.auth.user
  }

  public async show(ctx: HttpContextContract) {
    const user = await User.findBy('id', ctx.params.id)

    await user?.load('reactionRolesRules', (reactionRolesRulesQuery) => {
      reactionRolesRulesQuery.preload('reactionRoles')
    })

    return user
  }

  public async store(ctx: HttpContextContract) {
    const storeUserSchema = schema.create({
      email: schema.string({}, [
        rules.unique({ table: 'users', column: 'email' }),
        rules.email(),
        rules.required(),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
      guildId: schema.string({}, [rules.required()]),
    })

    const { email, password, guildId } = await ctx.request.validate({ schema: storeUserSchema })

    const user = await User.create({
      email,
      password,
      guildId,
    })

    return user
  }

  public async update(ctx: HttpContextContract) {
    if (!ctx.auth.user) return
    const updateUserSchema = schema.create({
      guildId: schema.string({}, [rules.required()]),
    })

    const { guildId } = await ctx.request.validate({ schema: updateUserSchema })

    const user = await ctx.auth.user.merge({ guildId }).save()

    return user
  }

  public async addReactionRole(ctx: HttpContextContract) {
    if (!ctx.auth.user) return

    const addReactionRoleUserSchema = schema.create({
      reactionId: schema.string({}, [rules.required()]),
      roleDiscordId: schema.string({}, [rules.required()]),
    })

    const { reactionId, roleDiscordId } = await ctx.request.validate({
      schema: addReactionRoleUserSchema,
    })

    const user = ctx.auth.user

    const reactionRolesRule = await ReactionRolesRule.findBy('user_id', user.id)

    const reactionRole = await reactionRolesRule
      ?.related('reactionRoles')
      .create({ reactionId, roleDiscordId })

    return reactionRole
  }

  public async deleteReactionRole(ctx: HttpContextContract) {
    if (!ctx.auth.user) return

    const deleteReactionRoleSchema = schema.create({
      reactionRoleId: schema.number([rules.required()]),
    })

    const { reactionRoleId } = await ctx.request.validate({
      schema: deleteReactionRoleSchema,
    })

    const reactionRole = await ReactionRole.find(reactionRoleId)

    await reactionRole?.delete()

    return reactionRole
  }
}
