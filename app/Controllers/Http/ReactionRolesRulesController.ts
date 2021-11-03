import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'
import ReactionRolesRule from 'App/Models/ReactionRolesRule'

export default class ReactionRolesRulesController {
  public async update(ctx: HttpContextContract) {
    if (!ctx.auth.user) return

    const updateReactionRolesRuleSchema = schema.create({
      id: schema.number([]),
      message: schema.string({}, []),
    })

    const { id, message } = await ctx.request.validate({
      schema: updateReactionRolesRuleSchema,
    })

    return ReactionRolesRule.updateOrCreate({ id }, { message })
  }
}
