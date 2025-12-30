const { REST, Routes, ActivityType } = require('discord.js');
const config = require('../config.json');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`✅ ${client.user.tag} olarak giriş yapıldı!`);
    
    
    const commands = [];
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      
      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.log(`[UYARI] ${filePath} komut dosyasında "data" veya "execute" özelliği eksik.`);
      }
    }

    
    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
      console.log(`${commands.length} slash komutu yenilenmeye başlıyor...`);

      const data = await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commands },
      );

      console.log(`${data.length} slash komutu başarıyla yenilendi.`);
    } catch (error) {
      console.error(error);
    }

    
    const registerChannel = client.channels.cache.get(config.registerChannelId);
    if (registerChannel) {
      try {
        const messages = await registerChannel.messages.fetch({ limit: 10 });
        const botMessages = messages.filter(m => m.author.id === client.user.id);
        
        if (botMessages.size > 0) {
          await registerChannel.bulkDelete(botMessages);
        }

        const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
        
        const embed = new EmbedBuilder()
          .setColor(0x00AE86)
          .setTitle('FiveM Ekip Kayıt Sistemi')
          .setDescription('Aşağıdaki butona tıklayarak sunucumuza kayıt olabilirsiniz.')
          .setTimestamp()
          .setFooter({ text: '787 Bot Service' });
        
        const row = new ActionRowBuilder()
          .addComponents(
            new ButtonBuilder()
              .setCustomId('register-button')
              .setLabel('Kayıt Başlat')
              .setStyle(ButtonStyle.Success)
              .setEmoji('📝')
          );
        
        await registerChannel.send({ embeds: [embed], components: [row] });
        console.log('Kayıt butonu başarıyla oluşturuldu.');
      } catch (error) {
        console.error('Kayıt butonu oluşturulurken hata oluştu:', error);
      }
    } else {
      console.error(`Kayıt kanalı bulunamadı: ${config.registerChannelId}`);
    }

   

    const statuses = [
      { name: "/help | Registration System", type: ActivityType.Playing },
      { name: "Powered by 787", type: ActivityType.Watching },
      { name: `Created by Zywexx`, type: ActivityType.Watching },
      { name: "discord.gg/CUFXct9PNz", type: ActivityType.Listening },
    ];

    let index = 0;

    setInterval(() => {
      const status = statuses[index];
      client.user.setActivity(status.name, { type: status.type });
      index = (index + 1) % statuses.length;
    }, 10000); // 10 saniyede bir değişir
  }
};
