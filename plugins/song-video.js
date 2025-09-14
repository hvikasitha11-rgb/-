const { cmd, commands } = require('../command');
const fg = require('api-dylux');
const yts = require('yt-search');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const axios = require('axios')
const config = require('../config')
const {readEnv} = require('../lib/database')
const fs = require('fs');
const path = require('path');

// Function to extract the video ID from youtu.be or YouTube links
function extractYouTubeId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|playlist\?list=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

// Function to convert any YouTube URL to a full YouTube watch URL
function convertYouTubeLink(q) {
    const videoId = extractYouTubeId(q);
    if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
    return q;
}

// .song command
cmd({
    pattern: "song",
    desc: "To download songs.",
    react: "🎵",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const config = await readEnv();
        const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Mreply.json')).replyMsg;
        
        if(!q) return reply(msr.giveme || "Please provide a song name or YouTube link");
        
        q = convertYouTubeLink(q);
        const search = await yts(q);
        if (!search.videos || search.videos.length === 0) {
            return reply(msr.not_fo || "No results found");
        }
        
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*🎶𝗛𝗜𝗥𝗨-𝗫-𝗠𝗗 𝗔𝗨𝗗𝗜𝗢🎶*  
*|__________________________*
*|-ℹ️ 𝗧𝗶𝘁𝗹𝗲 :* ${data.title}
*|-🕘 𝗧𝗶𝗺𝗲 :* ${data.timestamp}
*|-📌 𝗔𝗴𝗼 :* ${data.ago}
*|-📉 𝗩𝗶𝗲𝘄𝘀 :* ${data.views}
*|-🔗 𝗟𝗶𝗻𝗸 :* ${data.url}
*|__________________________*
`;

        const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data;
        let BTN = ownerdata.button || "Visit Website";
        let FOOTER = ownerdata.footer || "ASITHA-MD";
        let BTNURL = ownerdata.buttonurl || "https://github.com/ASITHA-MD";
        let prefix = config.PREFIX || ".";

        let buttons = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: BTN,
                    url: BTNURL,
                    merchant_url: BTNURL
                }),
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "GITHUB",
                    url: "https://github.com/ASITHA-MD/ASITHA-MD",
                    merchant_url: "https://github.com/ASITHA-MD/ASITHA-MD"
                }),
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Audio 🎵",
                    id: `${prefix}ytmp3 ${data.url}`
                }),
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 📑",
                    id: `${prefix}ytdoc ${data.url}`
                })
            }
        ];

        let opts = {
            image: {url: data.thumbnail},
            header: 'ASITHA-MD SONG DOWNLOADER',
            footer: FOOTER,
            body: desc
        };

        return await conn.sendButtonMessage(from, buttons, m, opts);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// .video command
cmd({
    pattern: "video",
    desc: "To download videos.",
    react: "🎥",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const config = await readEnv();
        const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Mreply.json')).replyMsg;
        
        if(!q) return reply(msr.giveme || "Please provide a video name or YouTube link");
        
        q = convertYouTubeLink(q);
        const search = await yts(q);
        if (!search.videos || search.videos.length === 0) {
            return reply(msr.not_fo || "No results found");
        }
        
        const data = search.videos[0];
        const url = data.url;

        let desc = `
*📽️𝗛𝗜𝗥𝗨-𝗫-𝗠𝗗 𝗩𝗜𝗗𝗘𝗢📽️*  
*|__________________________*
*|-ℹ️ 𝗧𝗶𝘁𝗹𝗲 :* ${data.title}
*|-🕘 𝗧𝗶𝗺𝗲 :* ${data.timestamp}
*|-📌 𝗔𝗴𝗼 :* ${data.ago}
*|-📉 𝗩𝗶𝗲𝘄𝘀 :* ${data.views}
*|-🔗 𝗟𝗶𝗻𝗸 :* ${data.url}
*|__________________________*
`;

        const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data;
        let BTN = ownerdata.button || "Visit Website";
        let FOOTER = ownerdata.footer || "ASITHA-MD";
        let BTNURL = ownerdata.buttonurl || "https://github.com/ASITHA-MD";
        let prefix = config.PREFIX || ".";

        let buttons = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: BTN,
                    url: BTNURL,
                    merchant_url: BTNURL
                }),
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Video 144p 🎥",
                    id: `${prefix}ytmp4 ${data.url} & 0`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Video 240p 🎥",
                    id: `${prefix}ytmp4 ${data.url} & 1`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Video 360p 🎥",
                    id: `${prefix}ytmp4 ${data.url} & 2`
                })
            },          
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Video 480p 🎥",
                    id: `${prefix}ytmp4 ${data.url} & 3`
                })
            },        
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Video 720p 🎥",
                    id: `${prefix}ytmp4 ${data.url} & 4`
                })
            },      
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Video 1080p 🎥",
                    id: `${prefix}ytmp4 ${data.url} & 5`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 144p 📑",
                    id: `${prefix}ytvdoc ${data.url} & 0`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 240p 📑",
                    id: `${prefix}ytvdoc ${data.url} & 1`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 360p 📑",
                    id: `${prefix}ytvdoc ${data.url} & 2`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 480p 📑",
                    id: `${prefix}ytvdoc ${data.url} & 3`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 720p 📑",
                    id: `${prefix}ytvdoc ${data.url} & 4`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Document 1080p 📑",
                    id: `${prefix}ytvdoc ${data.url} & 5`
                })
            }
        ];

        let opts = {
            image: {url: data.thumbnail},
            header: 'HIRU-X-MD VIDEO DOWNLOADER',
            footer: FOOTER,
            body: desc
        };

        return await conn.sendButtonMessage(from, buttons, m, opts);
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// .ytmp3 command
cmd({
    pattern: "ytmp3",
    react: "⬇",
    category: "download",
    dontAddCommandList: false,
    filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        const config = await readEnv();
        const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Mreply.json')).replyMsg;
        
        if(!q) return reply(msr.url || "Please provide a YouTube URL");
        
        q = convertYouTubeLink(q);
        if (!q.includes('youtube.com/watch')) return await reply(msr.not_fo || "Invalid YouTube URL");

        await conn.sendMessage(from, { react: { text: '⬆', key: mek.key }});
        
        // Using api-dylux for audio download
        const audio = await fg.ytmp3(q);
        if (!audio || !audio.download) {
            return reply("Failed to download audio");
        }
        
        await conn.sendMessage(from, { 
            audio: { url: audio.download }, 
            mimetype: "audio/mpeg",
            fileName: audio.title + ".mp3"
        }, {quoted: mek});
        
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key }});
    } catch(e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// .ytdoc command
cmd({
    pattern: "ytdoc",
    react: "⬇",    
    filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        const config = await readEnv();
        const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Mreply.json')).replyMsg;
        
        if(!q) return reply(msr.url || "Please provide a YouTube URL");
        
        q = convertYouTubeLink(q);
        if (!q.includes('youtube.com/watch')) return await reply(msr.not_fo || "Invalid YouTube URL");

        const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data;
        let FOOTER = ownerdata.footer || "ASITHA-MD";

        await conn.sendMessage(from, { react: { text: '⬆', key: mek.key }});
        
        // Using api-dylux for audio download
        const audio = await fg.ytmp3(q);
        if (!audio || !audio.download) {
            return reply("Failed to download audio");
        }
        
        const search = await yts(q);
        const data1 = search.videos[0];

        await conn.sendMessage(from, { 
            document: { url: audio.download }, 
            mimetype: "audio/mpeg", 
            fileName: data1.title + ".mp3", 
            caption: FOOTER
        }, {quoted: mek});
        
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key }});
    } catch(e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// .ytmp4 command
cmd({
    pattern: "ytmp4",
    desc: "Download YouTube videos as MP4.",
    react: "🎥",
    category: "download",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const config = await readEnv();
        const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Mreply.json')).replyMsg;

        if(!q) return reply(msr.url || "Please provide a YouTube URL");
        
        const parts = q.split(" & ");
        const urlPart = convertYouTubeLink(parts[0]);
        const qualityIndex = parts[1] || "0";
        
        if (!urlPart.includes('youtube.com/watch')) return await reply(msr.not_fo || "Invalid YouTube URL");

        await conn.sendMessage(from, { react: { text: '⬆', key: mek.key }});

        // Using api-dylux for video download
        const video = await fg.ytmp4(urlPart);
        if (!video || !video.video || video.video.length === 0) {
            return reply("Failed to download video");
        }
        
        // Select quality based on index
        const selectedQuality = video.video[qualityIndex] || video.video[0];
        
        await conn.sendMessage(from, { 
            video: { url: selectedQuality.url }, 
            mimetype: "video/mp4",
            caption: `Quality: ${selectedQuality.quality}`
        }, { quoted: mek });
        
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key }});
    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// .ytvdoc command
cmd({
    pattern: "ytvdoc",
    react: "⬇",    
    filename: __filename
},
async(conn, mek, m, {from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
    try {
        const config = await readEnv();
        const msr = (await fetchJson('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/Mreply.json')).replyMsg;
        
        if(!q) return reply(msr.url || "Please provide a YouTube URL");
        
        const parts = q.split(" & ");
        const urlPart = convertYouTubeLink(parts[0]);
        const qualityIndex = parts[1] || "0";
        
        if (!urlPart.includes('youtube.com/watch')) return await reply(msr.not_fo || "Invalid YouTube URL");

        const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data;
        let FOOTER = ownerdata.footer || "ASITHA-MD";

        await conn.sendMessage(from, { react: { text: '⬆', key: mek.key }});

        // Using api-dylux for video download
        const video = await fg.ytmp4(urlPart);
        if (!video || !video.video || video.video.length === 0) {
            return reply("Failed to download video");
        }
        
        // Select quality based on index
        const selectedQuality = video.video[qualityIndex] || video.video[0];
        
        const search = await yts(urlPart);
        const data3 = search.videos[0];

        await conn.sendMessage(from, { 
            document: { url: selectedQuality.url }, 
            mimetype: "video/mp4",
            fileName: data3.title + ".mp4", 
            caption: FOOTER
        }, {quoted: mek});
        
        await conn.sendMessage(from, { react: { text: '✔', key: mek.key }});
    } catch(e) {
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// .yts command
cmd({
    pattern: "yts",
    react: "🔎",
    alias: ["ytsearch", "ytfind"],
    desc: "Search YouTube and provide download options.",
    category: "search",
    use: '.yts <query>',
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, sender, reply }) => {
    try {
        const config = await readEnv();
        
        if (!q) return reply("Please provide a search term!");
        
        const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data;
        let BTN = ownerdata.button || "Visit Website";
        let FOOTER = ownerdata.footer || "ASITHA-MD";
        let BTNURL = ownerdata.buttonurl || "https://github.com/ASITHA-MD";
        let prefix = config.PREFIX || ".";

        const searchResults = await yts(q);
        const videos = searchResults.videos.slice(0, 5);

        if (!videos.length) return reply("No results found.");

        let rows = videos.map((video, index) => ({
            title: video.title.length > 20 ? video.title.substring(0, 20) + '...' : video.title,
            id: `${prefix}ytselect ${video.url}`
        }));

        let buttons = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: BTN,
                    url: BTNURL,
                    merchant_url: BTNURL
                }),
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "GITHUB",
                    url: "https://github.com/ASITHA-MD/ASITHA-MD",
                    merchant_url: "https://github.com/ASITHA-MD/ASITHA-MD"
                }),
            }, 
            { 
                name: 'single_select',
                buttonParamsJson: JSON.stringify({
                    title: 'Select Video',                        
                    sections: [{                            
                        title: 'Please select one',
                        highlight_label: 'Recommended',
                        rows: rows
                    }]
                })
            }
        ];

        let msg = `
⫷⦁[ *𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗  𝗬𝗧𝗦 𝗦𝗘𝗔𝗥𝗖𝗛* ]⦁⫸

🔎 *YouTube Search Results* for: *${q}*

Please select a video:
        `;

        let message = {
            image: {url: videos[0].thumbnail},
            header: 'YouTube Search Results',
            footer: FOOTER,
            body: msg
        };

        return conn.sendButtonMessage(from, buttons, m, message);
    } catch (e) {
        console.log(e);
        reply("An error occurred while searching on YouTube.");
    }
});

// .ytselect command
cmd({
    pattern: "ytselect",
    react: "🎥",
    use: ".ytselect",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, args, q, reply }) => {
    try {
        const config = await readEnv();
        q = convertYouTubeLink(q);
        const search = await yts(q);
        const data = search.videos[0];

        const ownerdata = (await axios.get('https://raw.githubusercontent.com/athulakumara604/ASITHA-MD-DATABASE/refs/heads/main/ditels/ditels.json')).data;
        let BTN = ownerdata.button || "Visit Website";
        let FOOTER = ownerdata.footer || "ASITHA-MD";
        let BTNURL = ownerdata.buttonurl || "https://github.com/ASITHA-MD";
        let prefix = config.PREFIX || ".";
        let desc = `SELECT WHAT YOU NEED`;

        let buttons = [
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: BTN,
                    url: BTNURL,
                    merchant_url: BTNURL
                }),
            },
            {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: "GITHUB",
                    url: "https://github.com/ASITHA-MD/ASITHA-MD",
                    merchant_url: "https://github.com/ASITHA-MD/ASITHA-MD"
                }),
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Download Audio 🎶",
                    id: `${prefix}song ${data.url}`
                }),
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "Download Video 📹",
                    id: `${prefix}video ${data.url}`
                })
            }
        ];

        let opts = {
            image: {url: data.thumbnail},
            header: 'HIRU-X-MD SELECTION',
            footer: FOOTER,
            body: desc
        };

        return await conn.sendButtonMessage(from, buttons, m, opts);
    } catch (e) {
        console.log(e);
        reply("An error occurred while processing your selection.");
    }
});