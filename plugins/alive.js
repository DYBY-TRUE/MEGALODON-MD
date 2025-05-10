import config from '../config.cjs';

const alive = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['alive', 'bot', 'status'];
    if (!validCommands.includes(cmd)) return;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const aliveMessage = `
*✅ MEGALODON-MD IS ONLINE!*
╭─────────────◆
│ *Bot Name:* MEGALODON-MD
│ *Uptime:* ${hours}h ${minutes}m ${seconds}s
│ *Mode:* ${global.public ? 'Public' : 'Private'}
│ *Owner:* 50934960331
╰─────────────◆
`.trim();

    const buttonsMessage = {
      image: { url: 'https://files.catbox.moe/rful77.jpg' },
      caption: aliveMessage,
      footer: 'MEGALODON-MD WHATSAPP BOT',
      buttons: [
        { buttonId: `${prefix}menu`, buttonText: { displayText: '📜 Menu' }, type: 1 },
        { buttonId: `${prefix}ping`, buttonText: { displayText: '📶 Ping' }, type: 1 }
      ],
      headerType: 4
    };

    await gss.sendMessage(m.from, buttonsMessage, { quoted: m });

  } catch (error) {
    console.error('Alive command error:', error);
    m.reply('❌ An error occurred in the alive command.');
  }
};

export default alive;
