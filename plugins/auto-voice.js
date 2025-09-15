const config = require('../config')
const { cmd } = require('../command');
const os = require("os")
const { runtime } = require('../lib/functions')
const axios = require('axios')

// Voice commands list (no prefix)
const voiceCommands = [
    { pattern: "hi",       react: "👋🏻", url: "https://files.catbox.moe/zz8y2l.mp3", desc: "Say Hi" },
    { pattern: "mk",       react: "🎙️", url: "https://files.catbox.moe/33ioeq.mp3", desc: "MK Voice" },
    { pattern: "gm",       react: "🌞", url: "https://files.catbox.moe/uii52y.mp3", desc: "Good Morning" },
    { pattern: "gn",       react: "🌙", url: "https://files.catbox.moe/mm46ev.mp3", desc: "Good Night" },
    { pattern: "bye",      react: "👋", url: "https://files.catbox.moe/t2uiab.mp3", desc: "Say Bye" },

    { pattern: "tharahada", react: "😡", url: "https://files.catbox.moe/xut7wl.mp3", desc: "තරහද Voice" },
    { pattern: "tharahayi", react: "😠", url: "https://files.catbox.moe/0t4g3h.mp3", desc: "තරහයි Voice" },
    { pattern: "adareyi",   react: "❤️", url: "https://files.catbox.moe/6hz8no.mp3", desc: "ආදරෙයි Voice" },
    { pattern: "gahapan",   react: "👊", url: "https://files.catbox.moe/tz4ydq.mp3", desc: "ගහපන් Voice" },
]

// Register all commands (no prefix)
for (let vc of voiceCommands) {
    cmd({
        pattern: vc.pattern,
        desc: vc.desc,
        category: "voice",
        react: vc.react,
        filename: __filename
    },
    async (conn, mek, m, { from, reply }) => {
        try {
            await conn.sendMessage(from, {
                audio: { url: vc.url },
                mimetype: 'audio/mp4',
                ptt: true
            }, { quoted: mek });
        } catch (e) {
            console.log(e);
            reply(`❌ Error: ${e}`);
        }
    });
}
