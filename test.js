const DiscordBot = require("./discord_bot");
const EmbedMsg = require("./modules/embedMsg");

const bot = new DiscordBot();

bot.on("ready", () => console.log("Bot sunucuya başarıyla giriş yaptı."));

bot.on("messageCreate", async (msg) => {
    const args = msg.content.slice(1).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    if (command === "say") {
        const content = args.join(" ");
        bot.sendMessage(msg.channel_id, content).then(() => {
            bot.deleteMessage(msg.channel_id, msg.id);
        });
    }
    if (command === 'sil') {
        const channelId = msg.channel_id; 
        const limit = parseInt(args[0]); 

        if (!limit || isNaN(limit)) {
            return console.log('Geçerli bir silme limiti belirtmelisiniz!');
        }
        bot.deleteMessages(channelId, limit).then(() => {
            bot.sendMessage(msg.channel_id, limit + " mesaj başarıyla silindi.")
            .then((botMsg) => {
                setTimeout(() => {
                    bot.deleteMessage(botMsg.channel_id, botMsg.id);
                }, 5000)
            })
        });
    }

    if (command === 'embed') {
        const embed = new EmbedMsg()
        .setTitle("Test Embed!")
        .setColor("#f7c22f")
        .setDescription("Bu bir embed mesaj komutudur.")
        .setAuthor("emirxrq")
        .setImage("https://indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png")
        .setURL("https://roseliasoftware.com")
        .setThumbnail("https://indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png")
        .setFooter("Powered by Roselia Software", "https://indiabioscience.org/imager/articles/411714/Aniruddha_feature-image_4b32b63c5c28c858e051e9d1a2a717a1.png")
        .setTimestamp(new Date())
        .build();

        bot.sendMessage(msg.channel_id, "Merhaba", embed).then(() =>{
            console.log("gönderildi!");
        }).catch(err => {
            console.error(err);
        });
    }

    console.table([
        { msgContent: msg.content,  msgChannelId: msg.channel_id, msgChannelName: await bot.getChannelName(msg.channel_id), msgAuthorName: msg.author.username, msgAuthorId: msg.author.id  }
    ])
})

bot.login("bot token");

