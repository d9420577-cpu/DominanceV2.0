const { Client, GatewayIntentBits, PermissionsBitField } = require('discord.js');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

const prefix = "a!"; // Komut başlatıcı

client.on('ready', () => {
    console.log(`${client.user.tag} artık çok daha güçlü!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // --- OTOMATİK CEVAPLAR ---
    const msg = message.content.toLowerCase();
    
    if (msg === 'sa') return message.reply('Aleykümselam hoş geldin kanka!');
    if (msg === 'hb') return message.reply('eyvallah, nasılsın?');
    if (msg === 'başla') return message.reply('https://www.pornhub.com (kral linki buraya yazdım ama dikkatli ol!)');

    // --- YÖNETİCİ KOMUTLARI ---
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    // KICK KOMUTU (a!kick @kullanıcı)
    if (command === 'kick') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply('Yetkin yok kanka!');
        const user = message.mentions.members.first();
        if (user) {
            user.kick().then(() => message.reply(`${user.user.tag} şutlandı!`)).catch(err => message.reply('Yetkim yetmiyor kanka.'));
        } else {
            message.reply('Kimi kovuyoruz? Etiketlesene.');
        }
    }

    // BAN KOMUTU (a!ban @kullanıcı)
    if (command === 'ban') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return message.reply('Yetkin yok kanka!');
        const user = message.mentions.members.first();
        if (user) {
            user.ban().then(() => message.reply(`${user.user.tag} sonsuzluğa uğurlandı!`)).catch(err => message.reply('Yetkim yetmiyor.'));
        } else {
            message.reply('Kimi banlıyoruz?');
        }
    }

    // SİL KOMUTU (a!sil 30)
    if (command === 'sil') {
        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return message.reply('Mesajları silme yetkin yok!');
        let miktar = parseInt(args[0]) || 10;
        if (miktar > 100) miktar = 100;
        
        message.channel.bulkDelete(miktar, true)
            .then(msgs => message.channel.send(`${msgs.size} tane mesajı süpürdüm kanka!`).then(m => setTimeout(() => m.delete(), 3000)))
            .catch(err => message.reply('Eski mesajları silemiyorum kanka (14 günden eskileri silinmez).'));
    }

    // OYLAMA KOMUTU (a!oylama Mesaj)
    if (command === 'oylama') {
        const oylamaMesaji = args.join(" ");
        if (!oylamaMesaji) return message.reply('Neyi oyluyoruz kanka?');
        
        message.delete();
        const embed = {
            title: '📊 OYLAMA BAŞLADI',
            description: oylamaMesaji,
            color: 0x00ff00,
            footer: { text: `${message.author.username} tarafından başlatıldı.` }
        };
        
        message.channel.send({ embeds: [embed] }).then(sentMsg => {
            sentMsg.react('✅');
            sentMsg.react('❌');
        });
    }
});

client.login(process.env.TOKEN);
