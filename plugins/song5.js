const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

// Temporary in-memory store
let userSelections = {};

cmd({
    pattern: 'song5',
    desc: 'Search and download song from YouTube',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        if (!text) return reply('❌ කරුණාකර song name එකක් type කරන්න.');

        // Search YouTube
        const r = await yts(text);
        const vid = r.videos[0]; // first result
        if (!vid) return reply('❌ කිසිම song result එකක් හමු නොවීය.');

        // Save user selection
        userSelections[from] = {
            title: vid.title,
            url: vid.url,
            seconds: vid.seconds,
            views: vid.views,
            author: vid.author.name
        };

        // Send menu
        const msg = `*🎧 HIRU X MD SONG DOWNLOADER*\n\n` +
        `*┏━━━━━━━━━━━━━━━*\n` +
        `*┃ 📌 Title:* ${vid.title}\n` +
        `*┃ ⏰ Duration:* ${Math.floor(vid.seconds/60)}:${vid.seconds%60}\n` +
        `*┃ 👤 Author:* ${vid.author.name}\n` +
        `*┃ 👀 Views:* ${vid.views}\n` +
        `*┃ 📎 URL:* ${vid.url}\n` +
        `*┗━━━━━━━━━━━━━━*\n\n` +
        `Reply with number:\n1 | Audio 🎧\n2 | Document 📂\n3 | Voice Note 🎙️`;

        reply(msg);

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});

// Handle reply numbers
cmd({
    pattern: '^[1-3]$',
    desc: 'Download song after user selection',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        const info = userSelections[from];
        if (!info) return reply('❌ Song selection not found. Use the song command first.');

        const stream = ytdl(info.url, { filter: 'audioonly' });

        if (text === '1') {
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: false }, { quoted: mek });
        } else if (text === '2') {
            await conn.sendMessage(from, { document: stream, mimetype: 'audio/mp4', fileName: `${info.title}.mp3` }, { quoted: mek });
        } else if (text === '3') {
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
        }

        // Clear user selection
        delete userSelections[from];

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});
