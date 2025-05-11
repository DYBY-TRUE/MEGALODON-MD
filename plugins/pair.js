import axios from 'axios';
import config from '../config.cjs';

const pair = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

    const validCommands = ['pair', 'getpair', 'clonebot'];
    if (!validCommands.includes(cmd)) return;

    const args = m.body.trim().split(/ +/).slice(1);
    let number = args[0];

    if (!number && m.quoted && m.quoted.text) {
      const match = m.quoted.text.match(/(\d{5,15})/);
      if (match) number = match[1];
    }

    if (!number || !number.startsWith('509')) {
      return await gss.sendMessage(m.from, {
        text: `❌ Please provide a valid number starting with *509* or reply to a message that contains one.\n\nExample: ${prefix}pair 50912345678`,
      }, { quoted: m });
    }

    const res = await axios.get(`https://meg-lodon-session.onrender.com/code?number=${number}`);
    if (!res.data || !res.data.code) {
      return await gss.sendMessage(m.from, {
        text: `❌ Failed to retrieve pairing code for ${number}.`,
      }, { quoted: m });
    }

    const code = res.data.code;
    const message = `
🔐 *PAIRING CODE SUCCESSFULLY GENERATED!*

• 👤 Number: ${number}
• 🔑 Code: ${code}
`.trim();

    await gss.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/sgvh0h.jpg' }, // You can replace this with your own image
      caption: message,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363372853772240@newsletter',
          newsletterName: "MEGALODON-MD",
          serverMessageId: 144
        }
      }
    }, { quoted: m });

  } catch (err) {
    console.error('Pairing command error:', err);
    m.reply(`❌ An error occurred while generating the pairing code. Error: ${err.message}`);
  }
};

export default pair;
