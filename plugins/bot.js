// bot.js
// Show HIRU X MD card with dynamic local time + greeting + round video intro
const { cmd } = require('../command');
const config = require('../config') || {};

cmd({
  pattern: "bot",   // <-- Command = .bot
  alias: ["hcard", "card", "hiru"],
  desc: "Show HIRU X MD card with logo and details",
  category: "info",
  react: "🤖",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {
    const videoUrl = "https://files.catbox.moe/pexn2m.mp4";
    const imageUrl = "https://files.catbox.moe/88ec05.jpg";

    // ========== Dynamic Time ==========
    const date = new Date();
    const options = { timeZone: "Asia/Colombo", hour12: false };
    const localTime = date.toLocaleTimeString("en-GB", options); 
    const today = date.toLocaleDateString("en-GB", { timeZone: "Asia/Colombo" });

    // ========== Dynamic Greeting ==========
    const hour = date.getHours();
    let greeting = "Hello!";
    if (hour >= 5 && hour < 12) {
      greeting = "Good Morning ☀️";
    } else if (hour >= 12 && hour < 17) {
      greeting = "Good Afternoon 🌤️";
    } else if (hour >= 17 && hour < 21) {
      greeting = "Good Evening 🌆";
    } else {
      greeting = "Good Night 🌙";
    }

    // ========== Caption ==========
    const caption =
`*◄●●━━𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭━━●●►*

*╭─「 ʙᴏᴛ ᴅᴇᴛᴀɪʟꜱ  ──●●►*
*│* 🙋 *User =* ⁱ ʜɪʀᴜ 𝗫 ᴍᴅ
*│* 📅 Date =* ${today}
*│* ⏰ Local Time =* ${localTime}
*│* 💬 Greeting =* ${greeting}
*│* 👾 *Bot =* ʜɪʀᴜ x ᴍᴅ ᴠ1
*│* ☎️ *Owner Nb =* 94702529242
*│* ☁️ Platform =* Github
*│* 👑 Owner =* Hirun Vikasitha
*│* ✒️ Prefix =* .
*╰──────────●●►*

*㋛ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗛𝗶𝗿𝘂 𝗫 𝗠𝗱*`;

    // ========== Buttons ==========
    const buttons = [
      { buttonId: '.menu', buttonText: { displayText: '📋 Menu' }, type: 1 },
      { buttonId: 'tel:94702529242', buttonText: { displayText: '📞 Owner' }, type: 1 }
    ];

    // 1️⃣ Send round video first
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: "video/mp4",
      ptt: true, // make it round
      fileName: "intro.mp4"
    }, { quoted: m });

    // 2️⃣ Send card with image + caption + buttons
    const messagePayload = {
      image: { url: imageUrl },
      caption: caption,
      footer: 'Powered by Hiru X Md',
      buttons: buttons,
      headerType: 4
    };

    await conn.sendMessage(from, messagePayload, { quoted: m });

  } catch (err) {
    console.error(err);
    await reply("❌ Card එක load වෙලා නැහැ, error එක check කරන්න.");
  }
});