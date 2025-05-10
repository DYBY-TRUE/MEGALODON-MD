import config from '../config.cjs';

const alive = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['alive', 'bot', 'uptime'];
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

    const buttons = [
      {
        buttonId: `${prefix}menu`,
        buttonText: { displayText: '📜 Menu' },
        type: 1,
      },
      {
        buttonId: `${prefix}ping`,
        buttonText: { displayText: '📶 Ping' },
        type: 1,
      }
    ];

    const imageUrl = 'https://files.catbox.moe/rful77.jpg';

    await gss.sendMessage(m.from, {
      image: { url: imageUrl },
      caption: aliveMessage,
      buttons: buttons,
      footer: 'MEGALODON-MD WHATSAPP BOT',
      headerType: 4
    }, { quoted: m });

  } catch (error) {
    console.error('Error:', error);
    m.reply('An error occurred while processing the command.');
  }
};

export default alive;
