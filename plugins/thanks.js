import config from '../config.cjs';

const thanks = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    
    const validCommands = ['thanks', 'thanksto', 'credits', 'merci'];
    if (!validCommands.includes(cmd)) return;

    const message = `
╭───❍ 🤝 *BIG THANKS TO* ❍───╮
│
│• Wasi_Tech ★
│• Steevy-Tech ★
│• Destructor ★
╰─────────────────────────╯
`.trim();

    await gss.sendMessage(m.from, {
      image: { url: 'https://files.catbox.moe/e65j50.jpeg' }, // Change si tu veux une autre image
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
    console.error('Thanks command error:', err);
    m.reply('❌ Une erreur est survenue avec la commande "thanks".');
  }
};

export default thanks;
