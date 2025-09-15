const { fetchJson } = require('../lib/functions')
const config = require('../config')
const { cmd, commands } = require('../command')

// FETCH API URL (lazy load if not ready)
let baseUrl;

async function ensureBaseUrl() {
    if (baseUrl) return baseUrl;
    try {
        const baseUrlGet = await fetchJson('https://raw.githubusercontent.com/prabathLK/PUBLIC-URL-HOST-DB/main/public/url.json');
        baseUrl = baseUrlGet.api;
        return baseUrl;
    } catch (err) {
        console.error('Failed to fetch baseUrl:', err);
        throw new Error('Could not fetch API base URL');
    }
}

// fb downloader
cmd({
    pattern: "fb",
    desc: "Download fb videos",
    category: "download",
    react: "📽️",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        if (!q || !q.startsWith("http")) return reply("Please provide a valid Facebook video URL!");
        // ensure baseUrl is ready
        await ensureBaseUrl();

        const apiUrl = `${baseUrl}/api/fdown?url=${encodeURIComponent(q)}`;
        const data = await fetchJson(apiUrl);

        if (!data || !data.data) {
            return reply('Failed to get video info from the API.');
        }

        const desc = ` *HIRU X MDFB DOWNLOADER*

*Reply This Message With Option*

*1 Download FB Video In HD*
*2 Download FB Video In SD*

*© 𝗣𝗼𝘄𝗲𝗿𝗲𝗱 𝗕𝘆 𝗛𝗶𝗿𝘂 𝗫 𝗠𝗱*`;

        // send prompt message (we'll watch replies to this stanzaId)
        const vv = await conn.sendMessage(from, { image: { url: "https://files.catbox.moe/de82e3.jpg"}, caption: desc }, { quoted: mek });

        // single-use listener
        const responseListener = async (msgUpdate) => {
            try {
                const msg = msgUpdate.messages && msgUpdate.messages[0];
                if (!msg || !msg.message) return;

                // only handle messages in same chat
                const remote = msg.key && msg.key.remoteJid;
                if (remote !== from) return;

                // ensure user replied to our prompt message (stanzaId match)
                const ext = msg.message.extendedTextMessage;
                if (!ext) return;
                const ctx = ext.contextInfo;
                if (!ctx || ctx.stanzaId !== vv.key.id) return;

                const selectedOption = (ext.text || '').trim();

                // remove listener immediately — single use
                conn.ev.off('messages.upsert', responseListener);

                switch (selectedOption) {
                    case '1': {
                        if (!data.data.hd) return reply('HD video not available.');
                        await conn.sendMessage(from, { video: { url: data.data.hd }, mimetype: "video/mp4", caption: "> ᴘᴀᴡᴇʀᴇᴅ ʙʏ ꜱᴜᴘᴜɴ ᴍᴅ" }, { quoted: mek });
                        break;
                    }
                    case '2': {
                        if (!data.data.sd) return reply('SD video not available.');
                        await conn.sendMessage(from, { video: { url: data.data.sd }, mimetype: "video/mp4", caption: "> ᴘᴀᴡᴇʀᴇᴅ ʙʏ ꜱᴜᴘᴜɴ ᴍᴅ" }, { quoted: mek });
                        break;
                    }
                    default:
                        // keep it simple: notify user and do not keep listener alive
                        await conn.sendMessage(from, { text: "Invalid option. Please select 1 or 2." }, { quoted: mek });
                }
            } catch (err) {
                console.error('responseListener error:', err);
                try { conn.ev.off('messages.upsert', responseListener); } catch (e) {}
            }
        };

        // attach listener
        conn.ev.on('messages.upsert', responseListener);

        // safety: automatically remove listener after 2 minutes (prevent leaks if no reply)
        setTimeout(() => {
            try { conn.ev.off('messages.upsert', responseListener); } catch (e) {}
        }, 2 * 60 * 1000);

    } catch (e) {
        console.error(e);
        try { await conn.sendMessage(from, { react: { text: '❌', key: mek.key } }) } catch (e2) {}
        reply('An error occurred while processing your request.');
    }
});