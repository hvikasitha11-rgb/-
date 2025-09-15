const { cmd } = require('../command');
const config = require('../config');


cmd({
    pattern: "owner",
    react: "👑",
    desc: "Display full owner and team info with image",
    category: "main",
    filename: __filename
},
async (conn, mek, m, { from }) => {
    try {
        const caption = `
*😼𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭 😼*
*╭──────────●●►*
*│𝗢𝘄𝗻𝗲𝗿 𝗡𝗮𝗺𝗲 = 𝚆𝙳. 𝙷𝙸𝚁𝚄𝙽*
*│𝗢𝘄𝗻𝗲𝗿 𝗡𝘂𝗺𝗯𝗲𝗿 = +94702529242*
*╰──────────●●►*

*㋛ 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗛𝗶𝗿𝘂𝗻 𝗩𝗶𝗸𝗮𝘀𝗶𝘁𝗵𝗮* `;

        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/88ec05.jpg' },
            caption: caption
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { text: `❌ Error: ${error.message}` });
    }
});

