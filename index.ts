import {
    ChannelType,
    Client,
    Events,
    GatewayIntentBits,
    Guild,
    PermissionsBitField,
    VoiceChannel
} from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const getPasteCount = async (): Promise<number> => {
    type PasteCountResponse = {
        numPastes: number;
    };

    const res = await fetch("https://paste.myst.rs/api/v2/data/numPastes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch paste count: ${res.statusText}`);
    }

    const data = (await res.json()) as PasteCountResponse;

    return data.numPastes;
};

const createPasteCountChannel = async (guild: Guild): Promise<VoiceChannel> => {
    const self = await guild.members.fetchMe();

    return await guild.channels.create({
        type: ChannelType.GuildVoice,
        name: "Paste Count: 0",
        permissionOverwrites: [
            {
                id: guild.roles.everyone,
                deny: PermissionsBitField.Flags.Connect
            },
            {
                id: self.id,
                allow: PermissionsBitField.Flags.Connect
            }
        ]
    });
};

const getOrCreatePasteCountChannel = async (guild: Guild): Promise<VoiceChannel> => {
    const existingChannel = guild.channels.cache.find(
        (channel) =>
            channel.name.startsWith("Paste Count:") && channel.type === ChannelType.GuildVoice
    ) as VoiceChannel | undefined;

    if (existingChannel) {
        return existingChannel;
    }

    return await createPasteCountChannel(guild);
};

const updatePasteCountChannels = async () => {
    const guilds = await client.guilds.fetch();

    let pasteCount = 0;
    try {
        pasteCount = await getPasteCount();
    } catch (error) {
        console.error(`Error fetching paste count: ${error}`);
        return;
    }

    for (const [guildId] of guilds) {
        const guild = await client.guilds.fetch(guildId);

        const pasteCountChannel = await getOrCreatePasteCountChannel(guild);
        await pasteCountChannel.edit({ name: `Paste Count: ${pasteCount}` });
    }
};

client.once(Events.ClientReady, () => {
    console.log(`Logged in as ${client.user?.tag}!`);
});

client.on(Events.GuildCreate, async (guild) => {
    console.log(`Joined guild: ${guild.name} (${guild.id})`);

    try {
        const pasteCountChannel = await getOrCreatePasteCountChannel(guild);
        const pasteCount = await getPasteCount();
        await pasteCountChannel.edit({ name: `Paste Count: ${pasteCount}` });
    } catch (error) {
        console.error(`Error updating paste count channel: ${error}`);
    }
});

client.login(process.env.TOKEN);

setInterval(updatePasteCountChannels, 60 * 60 * 1000);
