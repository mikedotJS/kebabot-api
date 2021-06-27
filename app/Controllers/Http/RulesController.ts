import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class RulesController {
  public async store(ctx: HttpContextContract) {
    if (!ctx.auth.user) return

    const storeRuleSchema = schema.create({
      type: schema.string({}, [rules.required()]),
      reaction: schema.string(),
      role: schema.string(),
    })

    const { type, reaction, role } = await ctx.request.validate({ schema: storeRuleSchema })

    const rule = ctx.auth.user.related('rules').create({ type, reaction, role })

    return rule
  }
}
