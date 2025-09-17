const config = require('../config')
const { cmd } = require('../command')

// Prefix එක (config.prefix එකෙන් ගන්න)
const prefixes = Array.isArray(config.prefix) ? config.prefix : [config.prefix]

// ================= COMMAND DATA =================
const comboCommands = [
    { pattern: "hi",        react: "👋🏻", url: "https://files.catbox.moe/zz8y2l.mp3", msg: "*හායි හායි ඔයා ලස්සන ළමයෝ ඔයා මොකද කරන්නේ 🥰🫶🏻........*" },
    { pattern: "gm",        react: "🌞", url: "https://files.catbox.moe/uii52y.mp3",  msg: "*Good Morning ළමයෝ 🥰🫶🏻......*" },
    { pattern: "gn",        react: "🌙", url: "https://files.catbox.moe/mm46ev.mp3",  msg: "*නිදාගන්නද හදන්නේ එහෙනම් Good Night🥱🫶🏻.........*" },
    { pattern: "bye",       react: "👋", url: "https://files.catbox.moe/t2uiab.mp3",  msg: "*කොහෙද යන්නේ එහෙනම් ගිහින් පරිස්සමෙන් එන්න 🥰🫶🏻..........*" },
    { pattern: "mk",        react: "🥱", url: "https://files.catbox.moe/33ioeq.mp3",  msg: "*මොකුත් නැ අනේ ඔයා මොකද කරන්නේ 🤔🥰........*" },

    { pattern: "adareyi",   react: "🫶🏻", url: "https://files.catbox.moe/6hz8no.mp3", msg: "*ඔයා මට කොච්චර ආදරෙයිද මන්නම් ඔයාට ගොඩාක් ආදරෙයි 🫶🏻💗............*" },
    { pattern: "ponnaya",   react: "😡", url: null, msg: "*තෝ නේ යකෝ පොන්නයා 😡*" },
    { pattern: "huththa",   react: "🤣", url: null, msg: "*අනේ පලයන් හුත්තෝ යන්න පකයා 🤣*" },
    { pattern: "vesi",      react: "☠️", url: null, msg: "*තොගේ පයිය කපලා අතට දෙනවා දැනගනින්☠️*" },
    { pattern: "tharahada", react: "🥹", url: "https://files.catbox.moe/xut7wl.mp3", msg: "*තරහද ? 🥹*" },
    { pattern: "tharahayi", react: "😡", url: "https://files.catbox.moe/0t4g3h.mp3", msg: "*තරහයි 😡*" },
    { pattern: "gahapan",   react: "💪🏻", url: "https://files.catbox.moe/tz4ydq.mp3", msg: "*ගහපන් 💪🏻*" },
]

// ================= REGISTER ALL =================
for (let cc of comboCommands) {

    const register = (pattern) => {
        cmd({
            pattern,
            desc: `Reply + Voice for ${cc.pattern}`,
            category: "combo",
            react: cc.react,
            filename: __filename
        },
        async (conn, mek, m, { from, reply }) => {
            try {
                // 1️⃣ send text first
                if (cc.msg) await reply(cc.msg)

                // 2️⃣ then send voice if exists
                if (cc.url) {
                    await conn.sendMessage(from, {
                        audio: { url: cc.url },
                        mimetype: 'audio/mp4',
                        ptt: true
                    }, { quoted: mek })
                }
            } catch (e) {
                console.log(e)
                reply(`❌ Error: ${e}`)
            }
        })
    }

    // register without prefix
    register(cc.pattern)

    // register with all prefixes
    for (let p of prefixes) {
        register(p + cc.pattern)
    }
}