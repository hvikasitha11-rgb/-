const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

// Fake quoted contact
const qMessage = {
  key: {
    fromMe: false,
    remoteJid: "status@broadcast",
    participant: "0@s.whatsapp.net",
  },
  message: {
    contactMessage: {
      displayName: "𝙷𝙸𝚃𝚄𝙽",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:HIRUN
TEL:+94702529242
END:VCARD`
    }
  }
};

// RAM Bar Generator
function generateRamBar(used, total, length = 10) {
  const percent = used / total;
  const filledLength = Math.round(length * percent);
  return "█".repeat(filledLength) + "░".repeat(length - filledLength);
}

// ALIVE COMMAND
cmd({
  pattern: "alive",
  alias: ["status", "bot", "online"],
  desc: "Check bot status",
  category: "main",
  react: "⚡",
  filename: __filename
}, async (conn, mek, m, { from }) => {
  try {
    const now = new Date();
    const time = now.toLocaleTimeString("en-US", {
      timeZone: "Asia/Colombo",
      hour12: true,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });

    const emojiMap = {
      "0": "𝟬", "1": "𝟭", "2": "𝟮", "3": "𝟯",
      "4": "𝟰", "5": "𝟱", "6": "𝟲", "7": "𝟳",
      "8": "𝟴", "9": "𝟵", ":": ":", "A": "𝗔",
      "P": "𝗣", "M": "𝗠", " ": " "
    };
    const toEmoji = str => str.split("").map(c => emojiMap[c] || c).join("");
    const emojiTime = toEmoji(time);

    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(0);
    const usedRam = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(0);
    const ramBar = generateRamBar(+usedRam, +totalRam);

    const ramInfo = `💾 RAM: [${ramBar}] ${usedRam}/${totalRam}MB`;

    const hour = parseInt(now.toLocaleString("en-US", {
      hour: "2-digit", hour12: false, timeZone: "Asia/Colombo"
    }));
    let greeting = "Hello!";
    if (hour >= 5 && hour < 12) greeting = "🌞 Good Morning!";
    else if (hour >= 12 && hour < 17) greeting = "☀️ Good Afternoon!";
    else if (hour >= 17 && hour < 20) greeting = "🌇 Good Evening!";
    else greeting = "🌙 Good Night!";

    const status = `
*𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭 𝗕𝗢𝗧 𝗢𝗡𝗟𝗜𝗡𝗘*
*╭──────────●●►*
*│👋* ${greeting}
*│⚡ Status:* Online
*│👑 Owner:* 𝙷𝙸𝚁𝚄𝙽
*│📌 Mode:* ${config.MODE === "public" ? "🌍 Public" : "🔐 Private"}
*│⌚ Time:* ${emojiTime}
*│⏱️ Uptime:* ${runtime(process.uptime())}
${ramInfo}
*│💻 Host:* ${os.hostname()}
*╰──────────●●►*

*㋛ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗛𝗶𝗿𝘂𝗻 𝗩𝗶𝗸𝗮𝘀𝗶𝘁𝗵𝗮*`;

    // Fixed image and video (optional)
    const imageUrl = 'https://files.catbox.moe/88ec05.jpg';
    const videoUrl = 'https://files.catbox.moe/78ogxl.mp4';

    // Send PTV video (optional)
    await conn.sendMessage(from, {
      video: { url: videoUrl },
      mimetype: 'video/mp4',
      ptv: true
    }, { quoted: qMessage });

    // Send image with caption
    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: status
    }, { quoted: qMessage });

  } catch (e) {
    console.error("Alive Error:", e);
    m.reply("❌ Alive command error:\n" + e.message);
  }
});
