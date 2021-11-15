import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import ReactionRole from 'App/Models/ReactionRole'
import ReactionRolesRule from 'App/Models/ReactionRolesRule'

export default class ReactionRolesRulesController {
  public async update(ctx: HttpContextContract) {
    if (!ctx.auth.user) return

    const updateReactionRolesRuleSchema = schema.create({
      id: schema.number.optional(),
      message: schema.string({}, []),
      reactionRoles: schema.array().members(
        schema.object().members({
          id: schema.number.optional(),
          reactionId: schema.string({}, []),
          roleDiscordId: schema.string({}, []),
        })
      ),
      channelId: schema.string({}, []),
    })

    const { message, channelId, reactionRoles } = await ctx.request.validate({
      schema: updateReactionRolesRuleSchema,
    })

    const reactionRolesRule = await ReactionRolesRule.updateOrCreate(
      { channelId },
      { message, channelId, userId: ctx.auth.user.id }
    )

    try {
      const reactionRoleIds = reactionRoles.map((reactionRole) => reactionRole.id).filter(Boolean)

      // @ts-ignore
      await ReactionRole.query().whereNotIn('id', reactionRoleIds).delete()

      await ReactionRole.updateOrCreateMany(
        ['reactionId', 'roleDiscordId'],
        reactionRoles.map((reactionRole) => ({
          ...reactionRole,
          reactionRolesRuleId: reactionRolesRule.id,
        }))
      )
    } catch (err) {
      console.error(err)
    }

    return reactionRolesRule
  }
}
