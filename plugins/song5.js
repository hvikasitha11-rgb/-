const { cmd } = require('../command');
const yts = require('yt-search');
const ytdl = require('ytdl-core');

// Temporary store for user selections
let userSelections = {};

/**
 * Step 1: Search and show top 5 results with buttons
 */
cmd({
    pattern: 'song2',
    desc: 'Hiru X MD Song Downloader with Buttons',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { text, from, reply }) => {
    try {
        if (!text) return reply('❌ Please type a song name.');

        const search = await yts(text);
        const videos = search.videos.slice(0, 5);
        if (!videos.length) return reply('❌ No results found.');

        // Store user selection list
        userSelections[from] = { videos };

        // Build buttons
        const buttons = videos.map((vid, i) => ({
            buttonId: `select_${i}`,
            buttonText: { displayText: `${i + 1} | ${vid.title.slice(0, 20)}...` },
            type: 1
        }));

        const buttonMessage = {
            image: { url: videos[0].thumbnail },
            caption: '🎧 Select a song by clicking a button below:',
            buttons: buttons,
            headerType: 4
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});

/**
 * Step 2: Handle song selection via button
 */
cmd({
    pattern: 'select_([0-4])',
    desc: 'User selected song',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { match, from, reply }) => {
    try {
        const index = parseInt(match[1]);
        const data = userSelections[from];
        if (!data?.videos || !data.videos[index]) return reply('❌ Invalid selection.');

        const vid = data.videos[index];
        userSelections[from] = { selected: vid };

        // Show download type buttons
        const downloadButtons = [
            { buttonId: 'download_audio', buttonText: { displayText: 'Audio 🎧' }, type: 1 },
            { buttonId: 'download_doc', buttonText: { displayText: 'Document 📂' }, type: 1 },
            { buttonId: 'download_ptt', buttonText: { displayText: 'Voice Note 🎙️' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: vid.thumbnail },
            caption: `🎶 Selected: ${vid.title}\nChoose download type:`,
            buttons: downloadButtons,
            headerType: 4
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});

/**
 * Step 3: Handle download buttons
 */
cmd({
    pattern: 'download_(audio|doc|ptt)',
    desc: 'Download selected song',
    category: 'downloader',
    filename: __filename
}, async (conn, mek, m, { match, from, reply }) => {
    try {
        const type = match[1]; // audio / doc / ptt
        const data = userSelections[from];
        if (!data?.selected) return reply('❌ Please select a song first.');

        const vid = data.selected;
        const stream = ytdl(vid.url, { filter: 'audioonly' });

        if (type === 'audio') {
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: false }, { quoted: mek });
        } else if (type === 'doc') {
            await conn.sendMessage(from, { document: stream, mimetype: 'audio/mp4', fileName: `${vid.title}.mp3` }, { quoted: mek });
        } else if (type === 'ptt') {
            await conn.sendMessage(from, { audio: stream, mimetype: 'audio/mp4', ptt: true }, { quoted: mek });
        }

        // Clear selection
        delete userSelections[from];

    } catch (e) {
        console.log(e);
        reply('❌ Error: ' + e);
    }
});
