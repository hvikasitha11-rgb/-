const { cmd } = require('../command');

cmd({
    pattern: "hack",
    alias: ["fakehack", "scare"],
    desc: "Fake hacking simulation to prank users",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, senderNumber, reply
}) => {
    try {
        const steps = [
            '💀 *𝗛𝗔𝗖𝗞𝗜𝗡𝗚 𝗦𝗧𝗔𝗥𝗡𝗜𝗡𝗚* 💀',

            '*Initializing hacking tools...* 🛠️',
            '*Connecting to remote servers...* 🌐',

            '```*●●●● 10%*``` ⏳',
            '```*●●●●●● 40%*``` ⏳',
            '```*⬤⬤⬤⬤⬤⬤⬤⬤ 70%*``` ⏳',
            '```*⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤⬤ 100%*``` ✅',

            '🔍 *Fetching chat history of target...*',
            '📁 *Extracting messages from chat database...*',
            '📡 *Tracing IP address: 192.168.0.105*',
            '🌍 *Location found: Ratnapuara, Sri Lanka*',
            '🔓 *Bypassing security protocols...*',
            '🧠 *Decrypting messages...*',
            '📥 *Downloading media files (images, videos, documents)...*',
            '🗂️ *Files found: 56 images, 23 videos, 8 docs*',
            '📤 *Uploading data to private server...*',

            '✅ *HACK COMPLETE!*',
            '⚠️ *All files from this number successfully extracted.*',
            ' *HIRU X MD SYSTEM ACCESS GRANTED. ALL DATA BACKED UP 🥷🏻*',
            '🕵️‍♂️ *You are being watched...*'
        ];

        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (err) {
        console.error(err);
        reply("⚠️ Error running fake hack simulation.");
    }
});
