import fs from 'fs';

const getChannelInfo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (cmd === "getchannelinfo") {
    const path = './channel-info.json';

    if (!fs.existsSync(path)) {
      return m.reply("Aucun canal détecté récemment. Envoie un message dans ton canal d'abord.");
    }

    const data = JSON.parse(fs.readFileSync(path));

    const formattedInfo = `*Dernier canal détecté :*\n\n` +
                          `*Nom Channe :* ${data.canalName}\n` +
                          `*JID :* ${data.newsletterJid}\n` +
                          `*Server Message ID :* ${data.serverMessageId}`;

    await gss.sendMessage(
      m.from,
      {
        text: formattedInfo,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: data.newsletterJid,
            newsletterName: data.canalName,
            serverMessageId: data.serverMessageId,
          },
        },
      },
      { quoted: m }
    );
  }
};

export default getChannelInfo;
