import config from '../config.cjs';

const alive = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    const validCommands = ['alive', 'bot', 'test'];
    if (!validCommands.includes(cmd)) return;

    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    const aliveMessage = `
✅ *MEGALODON-MD is alive!*

*Uptime:* ${hours}h ${minutes}m ${seconds}s
*Mode:* ${global.public ? 'Public' : 'Private'}
*Owner:* ${config.OWNER_NUMBER}
`.trim();

    await gss.sendMessage(m.from, {
      text: aliveMessage,
      footer: 'MEGALODON-MD WHATSAPP BOT',
      headerType: 1
    }, { quoted: m });

  } catch (err) {
    console.error('Alive command error:', err);
    m.reply('❌ An error occurred while running the alive command.');
  }
};

export default alive;
