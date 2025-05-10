const fs = require('fs');
const sudoPath = './sudo.json';

module.exports = {
  name: 'listsudo',
  category: 'Owner',
  desc: 'List all sudo users',
  async exec(m, conn, { isOwner }) {
    if (!isOwner) return m.reply("Only the owner can view the sudo list.");

    let sudo = JSON.parse(fs.readFileSync(sudoPath));
    if (sudo.length === 0) return m.reply("No sudo users found.");

    let list = sudo.map(jid => `• wa.me/${jid.replace(/[^0-9]/g, '')}`).join('\n');
    m.reply(`Current sudo users:\n${list}`);
  }
};
