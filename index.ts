import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.login(process.env.TOKEN);
