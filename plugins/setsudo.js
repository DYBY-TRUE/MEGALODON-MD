import fs from 'fs';
import config from '../config.cjs';

const setsudo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd !== 'setsudo') return;
  if (m.sender !== config.OWNER_NUMBER + '@s.whatsapp.net') return m.reply("*❌ ONLY THE OWNER CAN USE THIS COMMAND*");

  let sudoList = JSON.parse(fs.readFileSync('./sudo.json', 'utf-8'));

  const target = m.mentionedJid?.[0] ||
                 (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : null);

  if (!target) return m.reply("*❌ PLEASE MENTION OR PROVIDE A VALID NUMBER TO ADD AS SUDO*");

  if (sudoList.includes(target)) return m.reply("*✅ USER IS ALREADY A SUDO*");

  sudoList.push(target);
  fs.writeFileSync('./sudo.json', JSON.stringify(sudoList, null, 2));

  m.reply(`*✅ @${target.split('@')[0]} ADDED TO SUDO LIST*`, { mentions: [target] });
};

export default setsudo;
