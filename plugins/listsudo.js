import fs from 'fs';
import config from '../config.cjs';

const listsudo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd !== 'listsudo') return;
  if (m.sender !== config.OWNER_NUMBER + '@s.whatsapp.net') return m.reply("*❌ ONLY THE OWNER CAN USE THIS COMMAND*");

  let sudoList = JSON.parse(fs.readFileSync('./sudo.json', 'utf-8'));

  if (sudoList.length === 0) return m.reply("*🚫 NO SUDO USERS FOUND*");

  const list = sudoList.map(jid => `• wa.me/${jid.split('@')[0]}`).join('\n');
  m.reply(`*✅ CURRENT SUDO USERS:*\n${list}`);
};

export default listsudo;
