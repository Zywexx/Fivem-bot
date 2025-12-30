const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('onay')
    .setDescription('Belirtilen kullanıcının kayıt başvurusunu onaylar.')
    .addUserOption(option => option.setName('kullanıcı').setDescription('Başvurusu onaylanacak kullanıcı').setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  
  
  async execute(interaction, client) {
    
    
    await interaction.reply({ content: 'Bu komut doğrudan interactionCreate tarafından işleniyor.', ephemeral: true });
  },
};