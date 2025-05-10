const os = require("os");
const moment = require("moment-timezone");

module.exports = {
  name: "alive",
  alias: ["bot", "test"],
  desc: "Affiche l'état du bot",
  category: "General",
  usage: "alive",
  react: "✅",
  start: async (m, { sock, prefix, pushName }) => {
    const uptime = process.uptime();
    const formatUptime = (seconds) => {
      const pad = (s) => (s < 10 ? "0" + s : s);
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);
      return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    };

    const time = moment().tz("America/Port-au-Prince").format("HH:mm:ss");
    const date = moment().tz("America/Port-au-Prince").format("YYYY-MM-DD");

    const aliveMessage = `
╭──「 *MEGALODON-MD* 」
│
├► *Bot actif !*
├► *Nom:* ${pushName}
├► *Uptime:* ${formatUptime(uptime)}
├► *Date:* ${date}
├► *Heure:* ${time}
├► *Platforme:* ${os.platform()}
├► *Hôte:* ${os.hostname()}
│
╰──「 *Dybytech* 」
    `;

    await sock.sendMessage(m.from, { text: aliveMessage }, { quoted: m });
  },
};
export default alive;
