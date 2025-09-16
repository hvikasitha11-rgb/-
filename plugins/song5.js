const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

// Temporary storage for user selections
let userSelections = {};

/**
 * Search YouTube and show menu
 */
cmd({
    pattern: 'song3',
    desc: 'Hiru X MD Song Downloader with thumbnail and direct stream',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        if (!text) return reply('❌ Please type a song name.');

        // Search YouTube
        const search = await yts(text);
        const video = search.videos[0];
        if (!video) return reply('❌ No song results found.');

        // Store selection for user
        userSelections[from] = {
            title: video.title,
            url: video.url,
            seconds: video.seconds,
            views: video.views,
            author: video.author.name,
            thumbnail: video.thumbnail
        };

        // Build menu caption
        const caption = `
╭─「 🎧 HIRU X MD SONG DOWNLOADER 」─╮
│ 📌 Title : ${video.title}
│ ⏰ Duration : ${Math.floor(video.seconds/60)}:${video.seconds % 60 < 10 ? '0'+video.seconds % 60 : video.seconds % 60}
│ 👤 Author : ${video.author.name}
│ 👀 Views : ${video.views}
│ 📎 URL : ${video.url}
╰───────────────────────────────╯

Reply with number:
1 | Audio 🎧
2 | Document 📂
3 | Voice Note 🎙️
`;

        // Send thumbnail + menu
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption: caption
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});

/**
 * Handle user's reply selection (1/2/3)
 */
cmd({
    pattern: '^[1-3]$',
    desc: 'Send selected song as audio/document/voice note',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        const info = userSelections[from];
        if (!info) return reply('❌ Please use the .song command first.');

        // Stream audio from YouTube
        const stream = ytdl(info.url, { filter: 'audioonly' });

        if (text === '1') {
            // Send as audio
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: false }, { quoted: mek });
        } else if (text === '2') {
            // Send as document
            await conn.sendMessage(from, {
                document: stream,
                mimetype: 'audio/mp4',
                fileName: `${info.title}.mp3`
            }, { quoted: mek });
        } else if (text === '3') {
            // Send as voice note
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
        }

        // Clear user selection
        delete userSelections[from];

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});
