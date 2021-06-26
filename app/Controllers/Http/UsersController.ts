import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

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
}
