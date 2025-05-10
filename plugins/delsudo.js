const fs = require('fs');
const sudoPath = './sudo.json';

module.exports = {
  name: 'delsudo',
  alias: ['removesudo'],
  category: 'Owner',
  desc: 'Remove a sudo user',
  use: '@tag',
  async exec(m, conn, { isOwner }) {
    if (!isOwner) return m.reply("Only the owner can remove sudo users.");

    let mentioned = m.mentionedJid[0];
    if (!mentioned) return m.reply("Please tag a user to remove from sudo.");

    let sudo = JSON.parse(fs.readFileSync(sudoPath));
    if (!sudo.includes(mentioned)) return m.reply("This user is not a sudo.");

    sudo = sudo.filter(jid => jid !== mentioned);
    fs.writeFileSync(sudoPath, JSON.stringify(sudo, null, 2));
    m.reply(`Removed from sudo: ${mentioned.split('@')[0]}`);
  }
};
