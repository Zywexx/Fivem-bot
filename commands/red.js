const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('red')
    .setDescription('Belirtilen kullanıcının kayıt başvurusunu reddeder.')
    .addUserOption(option => option.setName('kullanıcı').setDescription('Başvurusu reddedilecek kullanıcı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  async execute(interaction, client) {
    await interaction.reply({ content: 'Bu komut doğrudan interactionCreate tarafından işleniyor.', ephemeral: true });
  },
};