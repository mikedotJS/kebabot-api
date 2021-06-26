import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'

export default class UsersController {
  public async store(ctx: HttpContextContract) {
    const newUserSchema = schema.create({
      email: schema.string({}, [
        rules.unique({ table: 'users', column: 'email' }),
        rules.email(),
        rules.required(),
      ]),
      password: schema.string({}, [rules.minLength(8)]),
    })

    const { email, password } = await ctx.request.validate({ schema: newUserSchema })

    const user = await User.create({
      email,
      password,
    })

    return user
  }
}
