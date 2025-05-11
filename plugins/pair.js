import axios from 'axios';
import config from '../config.cjs';

const pair = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const validCommands = ['pair', 'getpair', 'clonebot'];
    if (!validCommands.includes(cmd)) return;

    // Get number from args or quoted
    const args = m.body.trim().split(/ +/).slice(1);
    let number = args[0];

    if (!number && m.quoted && m.quoted.text) {
      const match = m.quoted.text.match(/(\d{5,15})/);
      if (match) number = match[1];
    }

    if (!number || !number.startsWith('509')) {
      return gss.sendMessage(m.from, {
        text: `❌ Please provide a valid number starting with *509* or reply to a message with one.\n\nExample: ${prefix}pair 50912345678`,
      }, { quoted: m });
    }

    // Fetch pairing code
    const res = await axios.get(`https://megalodon-md-v2.onrender.com/code?number=${number}`);
    const code = res.data?.code;

    if (!code) {
      return gss.sendMessage(m.from, {
        text: `❌ Failed to retrieve pairing code for ${number}.`,
      }, { quoted: m });
    }

    // Success message
    const message = `
✅ *PAIRING CODE GENERATED!*

• Number: ${number}
• Code: ${code}
    `.trim();

    await gss.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/sgvh0h.jpg' }, // Optional image
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
    console.error('PAIRING ERROR:', err);
    return m.reply(`❌ Error occurred while generating the pairing code:\n${err.message}`);
  }
};

export default pair;
