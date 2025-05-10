const fs = require('fs');
const sudoPath = './sudo.json';

module.exports = {
  name: 'setsudo',
  alias: ['addsudo'],
  category: 'Owner',
  desc: 'Ajoute un utilisateur comme sudo',
  use: '@tag',
  async exec(m, conn, { args, isOwner }) {
    if (!isOwner) return m.reply("Only the owner can add a sudo .");

    let mentioned = m.mentionedJid[0];
    if (!mentioned) return m.reply("Mention the user to add as sudo .");

    let sudo = JSON.parse(fs.readFileSync(sudoPath));
    if (sudo.includes(mentioned)) return m.reply("This user is already sudo. ");

    sudo.push(mentioned);
    fs.writeFileSync(sudoPath, JSON.stringify(sudo, null, 2));
    m.reply(`Added as sudo : ${mentioned.split('@')[0]}`);
  }
};
