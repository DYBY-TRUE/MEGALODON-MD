import axios from "axios";
import config from '../config.cjs';

const check = async (m, gss) => {
  try {
    const prefix = config.PREFIX;
    const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
    const args = m.body.trim().split(/\s+/).slice(1);

    if (cmd !== 'check') return;

    let code = args[0];
    if (!code) {
      return m.reply("❌ Please provide a country code. Example: `.check 254`");
    }

    code = code.replace(/\+/g, '');

    // Convert ISO country code to emoji flag
    const getFlagEmoji = (countryCode) =>
      countryCode.toUpperCase().split("")
        .map(letter => String.fromCodePoint(letter.charCodeAt(0) + 127397))
        .join("");

    // Fetch countries from v3.1 API
    const { data } = await axios.get("https://restcountries.com/v3.1/all");

    const matchingCountries = data.filter(c =>
      c.idd && c.idd.root && c.idd.suffixes &&
      c.idd.suffixes.some(suffix => (c.idd.root + suffix).replace('+', '') === code)
    );

    if (matchingCountries.length > 0) {
      const countryList = matchingCountries
        .map(c => `${getFlagEmoji(c.cca2)} ${c.name.common}`)
        .join("\n");

      const responseMessage = `
✅ *Country Code:* +${code}
🌍 *Countries found:*
${countryList}
      `.trim();

      await gss.sendMessage(m.from, {
        text: responseMessage
      }, { quoted: m });

    } else {
      m.reply(`❌ No country found for the code +${code}.`);
    }

  } catch (err) {
    console.error('Erreur de la commande check :', err);
    m.reply(`❌ An error occurred while checking the country code. Error: ${err.message}`);
  }
};

export default check;
