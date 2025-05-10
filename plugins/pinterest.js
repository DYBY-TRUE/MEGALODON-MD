import axios from "axios";
import config from '../config.cjs';

const pinterest = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const args = m.body.slice(prefix.length + cmd.length).trim().split(" ");

  if (cmd === "pinterest") {
    if (args.length === 0 || !args.join(" ")) {
      return m.reply("*❗ Please provide a keyword to search on Pinterest.*\n\nExample: .pinterest landscape");
    }

    const query = args.join(" ");
    m.reply(`*🔍 Searching Pinterest for:* _${query}_ ...`);

    try {
      const res = await axios.get(`https://api-dylux.vercel.app/api/pinterest?text=${encodeURIComponent(query)}`);
      const results = res.data.result;

      if (!results || results.length === 0) {
        return m.reply(`❌ No results found for "${query}".`);
      }

      const randomImage = results[Math.floor(Math.random() * results.length)];

      await gss.sendMessage(
        m.from,
        {
          image: { url: randomImage },
          caption: `✅ *Pinterest result for:* ${query}`,
        },
        { quoted: m }
      );
    } catch (err) {
      console.error(err);
      m.reply("❌ An error occurred while fetching Pinterest images.");
    }
  }
};

export default pinterest;
