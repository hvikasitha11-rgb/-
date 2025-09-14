const config = require('../config');
const { cmd } = require('../command');
const getFBInfo = require("@xaviabot/fb-downloader");

cmd({
  pattern: "fb",
  alias: ["fbdl"],
  desc: "Download Facebook videos (SD/HD only)",
  category: "download",
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ කරුණාකර වලංගු Facebook වීඩියෝ ලින්ක් එකක් දමන්න.");
    }

    await conn.sendMessage(from, { react: { text: "🔍", key: mek.key } });

    const result = await getFBInfo(q);
    const { sd, hd, title, thumbnail } = result;

    if (!sd && !hd) {
      return reply("❌ වීඩියෝ quality options සොයාගන්න බැරි වුණා.");
    }

    let caption = `*🎥 HIRU FACEBOOK  DOWNLOADER *

📌 *Title:* ${title}
🔗 *Link:* ${q}

📥 *Available Qualities:*
${sd ? "1. 🪫 SD Quality" : ""}
${hd ? "2. 🔋 HD Quality" : ""}

*© 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗛𝗶𝗿𝘂 𝗫 𝗠𝗱*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumbnail },
      caption,
      contextInfo: {
        externalAdReply: {
          title: 'HIRU X MD - Facebook Downloader',
          body: 'Powered by Chamindu',
          mediaType: 1,
          thumbnailUrl: thumbnail,
          sourceUrl: "https://github.com/CHMA2009/-CHAMA-MD"
        }
      }
    });

    const messageID = sentMsg.key.id;

    // Wait for reply
    conn.ev.on('messages.upsert', async (update) => {
      const msg = update.messages?.[0];
      if (!msg.message || msg.key.fromMe) return;

      const userReply = msg.message.conversation || msg.message.extendedTextMessage?.text;
      const isReply = msg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReply) {
        await conn.sendMessage(from, { react: { text: "⬇️", key: msg.key } });

        if (userReply === '1' && sd) {
          await conn.sendMessage(from, {
            video: { url: sd },
            caption: "*📥 SD Quality Video — HIRU X MD*"
          }, { quoted: msg });
        } else if (userReply === '2' && hd) {
          await conn.sendMessage(from, {
            video: { url: hd },
            caption: "*📥 HD Quality Video — HIRU X MD*"
          }, { quoted: msg });
        } else {
          await reply("❌ වැරදි විකල්පයක්. කරුණාකර 1 හෝ 2 ලෙසම reply කරන්න.");
        }

        await conn.sendMessage(from, { react: { text: "✅", key: msg.key } });
      }
    });

  } catch (e) {
    console.log(e);
    reply("❌ දෝෂයක් ඇතිවී ඇත: " + e.message);
  }
});
