import Discord from 'discord.js'
import Env from '@ioc:Adonis/Core/Env'

const client = new Discord.Client()

client.login(Env.get('DISCORD_BOT_TOKEN'))

export default client
