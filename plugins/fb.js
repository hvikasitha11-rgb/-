const { cmd } = require('../command');
const axios = require("axios");

cmd({
  pattern: "fb",
  desc: "Download Facebook videos (HD + SD)",
  category: "media",
  react: "📺",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    if (!args[0]) return reply("📝 *Please provide a Facebook video link!*");

    const url = args[0];
    reply("📥 *Fetching Facebook video links...*");

    // Free API
    const api = `https://api-scraper.vercel.app/fb?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    if (!res.data || (!res.data.hd && !res.data.sd)) {
      return reply("❌ Could not fetch video links!");
    }

    // Send SD if available
    if (res.data.sd) {
      await conn.sendMessage(m.chat, {
        video: { url: res.data.sd },
        caption: "✅ *Here is your SD video (📱)*"
      }, { quoted: mek });
    }

    // Send HD if available
    if (res.data.hd) {
      await conn.sendMessage(m.chat, {
        video: { url: res.data.hd },
        caption: "✅ *Here is your HD video (🎥)*"
      }, { quoted: mek });
    }

  } catch (e) {
    console.error(e);
    reply("⚠️ Error downloading Facebook video!");
  }
});