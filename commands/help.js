const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Kayıt botu yardım menüsünü gösterir"),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor(0x2b2d31) 
      .setAuthor({
        name: "Registration System",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTitle("📋 Yardım Menüsü")
      .setDescription(
        "**Sunucu kayıt işlemlerini profesyonel şekilde yönetin.**\n\n" +
        "Aşağıda botta kullanılabilir tüm komutlar ve açıklamaları yer almaktadır."
      )
      .addFields(
        {
          name: "🔒 Moderasyon Komutları",
          value:
            "`/ban` — Bir kullanıcıyı kayıt sisteminden yasaklar\n" +
            "`/unban` — Kullanıcının kayıt sistemi yasağını kaldırır",
          inline: false,
        },
        {
          name: "✅ Kayıt İşlemleri",
          value:
            "`/onay` — Kullanıcının kayıt başvurusunu onaylar\n" +
            "`/red` — Kullanıcının kayıt başvurusunu reddeder",
          inline: false,
        },
        {
          name: "⚙️ Sistem Ayarları",
          value:
            "`/setup` — Kayıt panelini oluşturur veya günceller",
          inline: false,
        }
      )
      .setFooter({
        text: "Created by Zywexx • Powered by 787 • discord.gg/CUFXct9PNz",
        iconURL: interaction.client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
