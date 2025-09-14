const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "film",
  alias: ["movie100", "movie"],
  desc: "Download Sinhala Sub Movies",
  category: "download",
  react: "🎬",
  filename: __filename
}, async (socket, msg, args) => {
  const sender = msg.key.remoteJid;
  try {
    try { 
      await socket.sendMessage(sender, { react: { text: `🕐`, key: msg.key } }); 
    } catch (e) {}

    const text = args.join(" ").trim();
    if (!text) {
      return await socket.sendMessage(sender, { 
        text: "❗ Please provide a movie name.\n👉 Example: `.film The Matrix`" 
      }, { quoted: msg });
    }

    const searchQuery = encodeURIComponent(text);
    const searchResponse = await axios.get(`https://apis.sandarux.sbs/api/download/sinhalasub/search?q=${searchQuery}`);

    if (!searchResponse.data.status || !Array.isArray(searchResponse.data.result) || searchResponse.data.result.length === 0) {
      try { 
        await socket.sendMessage(sender, { react: { text: `❌`, key: msg.key } }); 
      } catch (e) {}
      return await socket.sendMessage(sender, { 
        text: "❗ Film not found. Try another name." 
      }, { quoted: msg });
    }

    const movieSearchResult = searchResponse.data.result[0];
    const moviePageLink = movieSearchResult.link;

    await socket.sendMessage(sender, { 
      text: `✅ Found *${movieSearchResult.title}*.\n⏳ Fetching download link...` 
    }, { quoted: msg });

    const downloadResponse = await axios.get(`https://apis.sandarux.sbs/api/download/sinhalasub-dl?q=${encodeURIComponent(moviePageLink)}`);

    if (!downloadResponse.data || !downloadResponse.data.result || !Array.isArray(downloadResponse.data.result.downloadLinks)) {
      try { 
        await socket.sendMessage(sender, { react: { text: `❌`, key: msg.key } }); 
      } catch (e) {}
      return await socket.sendMessage(sender, { 
        text: "❗ Failed to retrieve download links for this movie." 
      }, { quoted: msg });
    }

    const downloadLinks = downloadResponse.data.result.downloadLinks;
    if (downloadLinks.length < 1) {
      try { 
        await socket.sendMessage(sender, { react: { text: `❌`, key: msg.key } }); 
      } catch (e) {}
      return await socket.sendMessage(sender, { 
        text: `❗ No download links available for this movie.` 
      }, { quoted: msg });
    }

    const downloadDetails = downloadLinks[1] || downloadLinks[0];
    const movieInfo = downloadResponse.data.result;

    await socket.sendMessage(sender, {
      document: { url: downloadDetails.link },
      mimetype: "video/mp4",
      fileName: `${(movieInfo.title || 'movie').replace(/\|.*$/,'').trim()} (${downloadDetails.quality || 'file'}).mp4`,
      caption: `🎬 *${movieInfo.title || 'Movie'}*\n\nHere is your file. Enjoy!`
    }, { quoted: msg });

    try { 
      await socket.sendMessage(sender, { react: { text: `✅`, key: msg.key } }); 
    } catch (e) {}

  } catch (error) {
    console.error("Error in film plugin:", error);
    try { 
      await socket.sendMessage(sender, { react: { text: `❌`, key: msg.key } }); 
    } catch (e) {}
    await socket.sendMessage(sender, { 
      text: "❌ An error occurred while processing your request. Please try again later." 
    }, { quoted: msg });
  }
});