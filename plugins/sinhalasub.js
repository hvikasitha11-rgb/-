const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

// Sinhala Sub Command
cmd({
    pattern: "sinhalasub",
    alias: ["ssub", "sinhala"],
    desc: "Get Sinhala subtitle movie details",
    category: "movie",
    react: "🎬",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        if (!args[0]) return reply("❌ Please provide a movie name!\n👉 Example: .sinhalasub Saiyaara");

        const movieName = args.join(" ");

        // TMDB API Key (replace with your api key)
        const apiKey = "YOUR_TMDB_API_KEY";
        const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(movieName)}`;

        const res = await axios.get(url);
        const results = res.data.results;

        if (!results || results.length === 0) {
            return reply("⚠️ Movie not found!");
        }

        const movie = results[0]; // take first match
        const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`;
        const detailsRes = await axios.get(detailsUrl);
        const details = detailsRes.data;

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : null;

        const caption = `☘️ *𝗧ɪᴛʟᴇ* ☛ *_${details.title} ( ${new Date(details.release_date).getFullYear()} ) Sinhala Subtitles | සිංහල උපසිරසි සමඟ_*

*▫️📅 𝗥ᴇʟᴇᴀꜱᴇ 𝗗ᴀᴛᴇ* ☛ *_${details.release_date || "N/A"}_*
*▫️🌎 𝗖ᴏᴜɴᴛʀʏ* ☛ *_${details.production_countries?.[0]?.name || "Unknown"}_*
*▫️⏱️ 𝗗ᴜʀᴀᴛɪᴏɴ* ☛ *_${details.runtime ? details.runtime + " Min." : "N/A"}_*
*▫️🎭 𝗚ᴇɴʀᴇꜱ* ☛ *_${details.genres?.map(g => g.name).join(", ") || "N/A"} with Sinhala subtitle_*
*▫️👨🏻‍💼 𝗗ɪʀᴇᴄᴛᴏʀ* ☛ *_${details.credits?.crew?.find(c => c.job === "Director")?.name || "N/A"}_*
*▫️🕵️‍♂️ 𝗖ᴀsᴛ* ☛ *_${details.credits?.cast?.slice(0, 5).map(c => c.name).join(", ") || "N/A"}_*

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟*
*▫️🔗 𝗝ᴏɪɴ* ☛ *https://whatsapp.com/channel/0029VbAtADv0LKZFPYOW4M2f*
*➟➟➟➟➟➟➟➟➟➟➟➟➟➟* 
*© Hiru X Md V1*`;

        if (poster) {
            await conn.sendMessage(m.chat, { image: { url: poster }, caption }, { quoted: mek });
        } else {
            reply(caption);
        }

    } catch (e) {
        console.error(e);
        reply("❌ Error fetching movie details!");
    }
});