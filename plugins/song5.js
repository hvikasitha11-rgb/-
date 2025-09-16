const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

// Temporary store for user selections
let userSelections = {};

cmd({
    pattern: 'song3',
    desc: 'Hiru X MD Song Downloader with thumbnail',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        if (!text) return reply('❌ කරුණාකර song name එකක් type කරන්න.');

        // Search YouTube
        const r = await yts(text);
        const vid = r.videos[0];
        if (!vid) return reply('❌ කිසිම song result එකක් හමු නොවීය.');

        // Save selection
        userSelections[from] = {
            title: vid.title,
            url: vid.url,
            seconds: vid.seconds,
            views: vid.views,
            author: vid.author.name,
            thumbnail: vid.thumbnail
        };

        // Build nicely formatted menu message
        const caption = `
╭─「 🎧 HIRU X MD SONG DOWNLOADER 」─╮
│ 📌 Title : ${vid.title}
│ ⏰ Duration : ${Math.floor(vid.seconds/60)}:${vid.seconds%60}
│ 👤 Author : ${vid.author.name}
│ 👀 Views : ${vid.views}
│ 📎 URL : ${vid.url}
╰───────────────────────────────╯

Reply with number:
1 | Audio 🎧
2 | Document 📂
3 | Voice Note 🎙️
`;

        // Send thumbnail + caption
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});

// Handle number reply
cmd({
    pattern: '^[1-3]$',
    desc: 'Download song after user selection',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        const info = userSelections[from];
        if (!info) return reply('❌ Song selection not found. Please use the song command first.');

        const stream = ytdl(info.url, { filter: 'audioonly' });

        if (text === '1') {
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: false }, { quoted: mek });
        } else if (text === '2') {
            await conn.sendMessage(from, { document: stream, mimetype: 'audio/mp4', fileName: `${info.title}.mp3` }, { quoted: mek });
        } else if (text === '3') {
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
        }

        delete userSelections[from];

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});
