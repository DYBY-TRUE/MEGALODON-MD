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
👋 Hello @${m.sender.split('@')[0]}

✅ *MEGALODON-MD is Alive!*

⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s  
🔐 *Mode:* ${global.public ? 'Public' : 'Private'}  
👑 *Owner:* ${config.OWNER_NUMBER}
`.trim();

    await gss.sendMessage(m.from, {
      image: { url: 'https://i.ibb.co/4m3Z4Mn/megalodon-banner.jpg' }, // Replace with your image if needed
      caption: aliveMessage,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363372853772240@newsletter',
          newsletterName: "MEGALODON-MD",
          serverMessageId: 143
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('Alive command error:', err);
    m.reply('❌ An error occurred while executing the alive command.');
  }
};

export default alive;
