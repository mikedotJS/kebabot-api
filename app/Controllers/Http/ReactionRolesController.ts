import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ReactionRole from 'App/Models/ReactionRole'
import ReactionRolesRule from 'App/Models/ReactionRolesRule'

export default class ReactionRolesController {
  public async store(ctx: HttpContextContract) {
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

  public async destroy(ctx: HttpContextContract) {
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
