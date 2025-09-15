const config = require('../config');
const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');
const { fetchJson } = require('../lib/functions2');

cmd({
  pattern: "video",
  react: "🎥",
  desc: "Download YouTube video",
  category: "main",
  use: '.video <YouTube URL or name>',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ *Please provide a YouTube URL or name.*");

    const yt = await ytsearch(q);
    if (!yt.results.length) return reply("🚫 *No results found!*");

    const yts = yt.results[0];
    const videoData = await fetchJson(`https://sadas-ytmp4-5.vercel.app/convert?link=${yts.url}&format=mp4&videoQuality=360`);

    const captionMsg = `
╭─────〘 *🎥 VIDEO DETAILS* 〙─────╮
├ 📌 *Title:* ${yts.title}
├ ⏳ *Duration:* ${yts.timestamp}
├ 👁️ *Views:* ${yts.views}
├ 👤 *Author:* ${yts.author.name}
├ 🔗 *URL:* ${yts.url}
╰──────────────────────────────╯

📥 *Choose a format to download:*

1️⃣ – *Video Type* 🎬  
2️⃣ – *Document Type* 📁

───────────────
*♯ Powered by HIRU-X-MD*
`;

    const videoMsg = await conn.sendMessage(from, {
      image: { url: yts.thumbnail },
      caption: captionMsg
    }, { quoted: mek });

    conn.ev.on("messages.upsert", async (msgUpdate) => {
      const replyMsg = msgUpdate.messages?.[0];
      if (!replyMsg?.message?.extendedTextMessage) return;

      const text = replyMsg.message.extendedTextMessage.text.trim();
      const replyTo = replyMsg.message.extendedTextMessage.contextInfo?.stanzaId;

      if (replyTo !== videoMsg.key.id) return;

      if (text === "1") {
        await conn.sendMessage(from, {
          video: { url: videoData.url },
          caption: "🎬 *Here's your video (360p)*\n\n♯ Powered by HIRU-X-MD"
        }, { quoted: replyMsg });
      } else if (text === "2") {
        await conn.sendMessage(from, {
          document: { url: videoData.url },
          mimetype: "video/mp4",
          fileName: `${yts.title}.mp4`,
          caption: "📁 *Here's your document file (360p)*\n\n♯ Powered by HIRU-X-MD"
        }, { quoted: replyMsg });
      } else {
        await conn.sendMessage(from, {
          text: "⚠️ *Invalid reply.*\nPlease reply with:\n1️⃣ for *Video*\n2️⃣ for *Document*"
        }, { quoted: replyMsg });
      }
    });

  } catch (e) {
    console.error(e);
    reply("⚠️ *Something went wrong. Please try again later.*");
  }
});
