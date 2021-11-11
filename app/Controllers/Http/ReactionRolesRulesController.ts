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

    const { message, channelId, reactionRoles, id } = await ctx.request.validate({
      schema: updateReactionRolesRuleSchema,
    })

    try {
      await ReactionRole.updateOrCreateMany(
        ['reactionId', 'roleDiscordId'],
        reactionRoles.map((reactionRole) => ({ ...reactionRole, reactionRolesRuleId: id }))
      )

      const reactionRoleIds = reactionRoles.map((reactionRole) => reactionRole.id)

      // @ts-ignore
      await ReactionRole.query().whereNotIn('id', reactionRoleIds).delete()
    } catch (err) {
      console.error(err)
    }

    return ReactionRolesRule.updateOrCreate({ channelId }, { message, channelId })
  }
}
