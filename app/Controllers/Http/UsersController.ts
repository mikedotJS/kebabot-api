import User from 'App/Models/User';

import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext';
import { rules, schema } from '@ioc:Adonis/Core/Validator';

export default class UsersController {
  public async show(ctx: HttpContextContract) {
    const user = await User.findBy('id', ctx.params.id)

    await user?.load('rules')

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
}
