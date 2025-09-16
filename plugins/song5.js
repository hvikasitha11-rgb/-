const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

// Temporary store for user selections
let userSelections = {};

cmd({
    pattern: 'song5',
    desc: 'Hiru X MD Song Downloader',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        if (!text) return reply('❌ YouTube link එකක් හෝ song title එකක් type කරන්න.');

        // Fetch YouTube info
        let info;
        if (text.includes('youtube.com')) {
            const id = text.split('v=')[1].split('&')[0];
            const video = await ytdl.getInfo(id);
            info = {
                title: video.videoDetails.title,
                url: video.videoDetails.video_url,
                lengthSeconds: video.videoDetails.lengthSeconds,
                author: video.videoDetails.author.name,
                views: video.videoDetails.viewCount,
            };
        } else {
            const r = await yts(text);
            const vid = r.videos[0];
            info = {
                title: vid.title,
                url: vid.url,
                lengthSeconds: vid.seconds,
                author: vid.author.name,
                views: vid.views,
            };
        }

        userSelections[from] = info;

        const msg = `*🎧 HIRU X MD SONG DOWNLOADER*\n\n` +
        `*┏━━━━━━━━━━━━━━━*\n` +
        `*┃ 📌 Title:* ${info.title}\n` +
        `*┃ ⏰ Duration:* ${Math.floor(info.lengthSeconds/60)}:${info.lengthSeconds%60}\n` +
        `*┃ 👤 Author:* ${info.author}\n` +
        `*┃ 👀 Views:* ${info.views}\n` +
        `*┃ 📎 URL:* ${info.url}\n` +
        `*┗━━━━━━━━━━━━━━*\n\n` +
        `Reply with number:\n` +
        `1 | Audio 🎧\n` +
        `2 | Document 📂\n` +
        `3 | Voice Note 🎙️\n\n` +
        `> © POWERED BY HIRU X MD`;

        reply(msg);

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});

// Listen for number replies
cmd({
    pattern: '^[1-3]$',
    desc: 'Handle Hiru X MD song download reply',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        const info = userSelections[from];
        if (!info) return reply('❌ Please select a song first using the song command.');

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