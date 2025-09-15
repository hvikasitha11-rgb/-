const config = require('../config')
const { cmd, commands } = require('../command');
const os = require("os")
const { runtime } = require('../lib/functions')
const axios = require('axios')

cmd({
    pattern: "hi",
    desc: "Show all bot commands",
    category: "menu",
    react: "👋🏻",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Send audio only
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/zz8y2l.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`❌ Error: ${e}`);
    }
});