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
    if (!args[0]) 
      return reply("📝 Please provide a valid Facebook video link!");

    const url = args[0];
    reply("📥 Fetching Facebook video links...");

    // API request
    const api = `https://api-scraper.vercel.app/fb?url=${encodeURIComponent(url)}`;
    const res = await axios.get(api);

    const { hd, sd } = res.data || {};

    if (!hd && !sd) 
      return reply("❌ Could not fetch video links!");

    // Send links
    let links = "📺 *Facebook Video Downloader*\n\n";
    if (sd) links += `📱 *SD:* ${sd}\n`;
    if (hd) links += `🎥 *HD:* ${hd}\n`;

    await conn.sendMessage(m.chat, { text: links }, { quoted: mek });

    // Send SD video
    if (sd) {
      await conn.sendMessage(m.chat, {
        video: { url: sd },
        caption: "📱 Here is your *SD video*"
      }, { quoted: mek });
    }

    // Send HD video
    if (hd) {
      await conn.sendMessage(m.chat, {
        video: { url: hd },
        caption: "🎥 Here is your *HD video*"
      }, { quoted: mek });
    }

  } catch (e) {
    reply("⚠️ Error downloading Facebook video!");
  }
});
