// coded by jawadtech x

const path = require("path");
const { fetchGif, fetchImage, gifToSticker } = require('../lib/sticker-utils');
const { tmpdir } = require("os");
const fetch = require("node-fetch");
const Crypto = require("crypto");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require("../lib/functions");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const { cmd } = require('../command');
const { videoToWebp } = require('../lib/video-utils');
const { Sticker, createSticker, StickerTypes } = require("wa-sticker-formatter");
const config = require("../config");

cmd(
  {
    pattern: 'vsticker',
    alias: ['gsticker', 'g2s', 'gs', 'v2s', 'vs',],
    desc: 'Convert GIF/Video to a sticker.',
    category: 'sticker',
    use: '<reply media or URL>',
    filename: __filename,
  },
  async (conn, mek, m, { quoted, args, reply }) => {
    try {
      if (!mek.quoted) return reply('*Reply to a video or GIF to convert it to a sticker!*');

      const mime = mek.quoted.mtype;
      if (!['videoMessage', 'imageMessage'].includes(mime)) {
        return reply('*Please reply to a valid video or GIF.*');
      }

      // Download the media file
      const media = await mek.quoted.download();

      // Convert the video to a WebP buffer
      const webpBuffer = await videoToWebp(media);

      // Generate sticker metadata
      const sticker = new Sticker(webpBuffer, {
        pack: config.STICKER_NAME || '𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭',
        author: '', // Leave blank or customize
        type: StickerTypes.FULL, // FULL for regular stickers
        categories: ['🤩', '🎉'], // Emoji categories
        id: '12345', // Optional ID
        quality: 75, // Set quality for optimization
        background: 'transparent', // Transparent background
      });

      // Convert sticker to buffer and send
      const stickerBuffer = await sticker.toBuffer();
      return conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (error) {
      console.error(error);
      reply(`❌ An error occurred: ${error.message}`);
    }
  }
);    



cmd(
  {
    pattern: 'tsticker',
    alias: ['textsticker', 't2s'],
    desc: 'Convert text to a sticker.',
    category: 'sticker',
    use: '<text>',
    filename: __filename,
  },
  async (conn, mek, m, { args, reply }) => {
    const text = args.join(' ');
    if (!text) return reply('✏️ *කරුණාකර වචනයක් හෝ වාක්‍යයක් type කරන්න!*');

    try {
      const { Sticker, StickerTypes } = require('wa-sticker-formatter');
      const { createCanvas } = require('canvas');

      const canvas = createCanvas(512, 512);
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#ffffff'; // background
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#000000'; // text color
      ctx.font = 'bold 38px Sans';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 256);

      const buffer = canvas.toBuffer();

      const sticker = new Sticker(buffer, {
        pack: config.STICKER_NAME || 'HIRU X MD',
        author: 'Chama Bot',
        type: StickerTypes.FULL,quality: 80,
        background: 'transparent',
      });

      const stickerBuffer = await sticker.toBuffer();
      await conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply('❌ Error: ' + e.message);
    }
  }
);

cmd({
    pattern: "attp",
    desc: "Convert text to a GIF sticker.",
    react: "✨",
    category: "convert",
    use: ".attp HI",
    filename: __filename,
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("*Please provide text!*");

        const gifBuffer = await fetchGif(`https://api-fix.onrender.com/api/maker/attp?text=${encodeURIComponent(args[0])}`);
        const stickerBuffer = await gifToSticker(gifBuffer);

        await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: mek });
    } catch (error) {
        reply(`❌ ${error.message}`);
    }
});


cmd(
  {
    pattern: 'vsticker',
    alias: ['gsticker', 's2g', 'gs', 'stg', 'vs'],
    desc: 'Convert GIF/Video to animated sticker.',
    category: 'sticker',
    use: '<reply to video or gif>',
    filename: __filename,
  },
  async (conn, mek, m, { quoted, args, reply }) => {
    try {
      // Proper media check
      if (!quoted || !['videoMessage', 'imageMessage'].includes(quoted.mtype)) {
        return reply('🥺 *Please reply to a valid video or gif to make it a sticker!*');
      }

      const media = await quoted.download(); // download video/gif

      const webpBuffer = await videoToWebp(media, true); // convert to animated sticker

      const sticker = new Sticker(webpBuffer, {
        pack: config.STICKER_NAME || 'HIRU X MD',
        author: 'JawadTech',
        type: StickerTypes.FULL,
        categories: ['🔥', '✨'],
        id: 'animatedsticker01',
        quality: 75,
        background: 'transparent',
      });

      const stickerBuffer = await sticker.toBuffer();

      await conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

    } catch (e) {
      console.error(e);
      reply(`❌ Error: ${e.message}`);
    }
  }
);

