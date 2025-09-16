// cinesubz.js
// Usage: .cinesubz <movie name>
// Requires: ../config exports { OMDB_API_KEY?, TMDB_API_KEY?, prefix?, JOIN_LINK? }
// Uses: axios
const config = require('../config')
const { cmd } = require('../command')
const axios = require('axios')

const joinLink = config.JOIN_LINK || 'https://whatsapp.com/channel/0029VbAtADv0LKZFPYOW4M2f' // fallback

cmd({
  pattern: "cinesubz",
  desc: "Fetch movie info + poster (Sinhala subtitle style)",
  category: "movie",
  react: "🎬",
  filename: __filename
},
async (conn, mek, m, { from, args, reply, quoted, isBotAdmin, isAdmin }) => {
  try {
    const query = (args || []).join(' ').trim()
    if (!query) return reply(`උදාහරණය: ${config.prefix || '.'}cinesubz The Karate Kid: Legends\nඔබ movie එකේ නම ටයිප් කරලා එවන්න.`)

    // Try OMDb first (simple)
    const omdbKey = config.OMDB_API_KEY || process.env.OMDB_API_KEY
    let movie = null
    let poster = null

    if (omdbKey) {
      try {
        const omdbUrl = `http://www.omdbapi.com/?t=${encodeURIComponent(query)}&plot=full&apikey=${omdbKey}`
        const res = await axios.get(omdbUrl, { timeout: 10000 })
        if (res.data && res.data.Response === 'True') {
          movie = res.data
          poster = (res.data.Poster && res.data.Poster !== 'N/A') ? res.data.Poster : null
        }
      } catch (e) {
        // silent, will try TMDB next
      }
    }

    // If OMDb failed, try TMDB (needs API key)
    if (!movie) {
      const tmdbKey = config.TMDB_API_KEY || process.env.TMDB_API_KEY
      if (!tmdbKey) {
        return reply(
          `කණගාටුයි — movie data fetch කිරීම සඳහා API key එකක් අවශ්‍යයි.\nඔබට config.js හෝ environment variables තුළ OMDB_API_KEY හෝ TMDB_API_KEY එකක් සපයන්න.`
        )
      }

      // 1) search movie on TMDB
      const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${tmdbKey}&query=${encodeURIComponent(query)}&language=en-US&page=1&include_adult=false`
      const searchRes = await axios.get(searchUrl, { timeout: 10000 })
      if (searchRes.data && searchRes.data.results && searchRes.data.results.length > 0) {
        const first = searchRes.data.results[0]
        // 2) get details
        const detailUrl = `https://api.themoviedb.org/3/movie/${first.id}?api_key=${tmdbKey}&language=en-US`
        const detailRes = await axios.get(detailUrl, { timeout: 10000 })
        const d = detailRes.data

        // Map TMDB response to OMDb-like object for template convenience
        movie = {
          Title: d.title || first.title || query,
          Year: (d.release_date && d.release_date.split('-')[0]) || 'Unknown',
          Runtime: d.runtime ? `${d.runtime} min` : 'Unknown',
          Genre: (d.genres && d.genres.map(g => g.name).join(', ')) || 'Unknown',
          Director: (d.credits && d.credits.crew) ? (d.credits.crew.find(c => c.job === 'Director')?.name || 'Unknown') : 'Unknown',
          Actors: (d.credits && d.credits.cast) ? d.credits.cast.slice(0,6).map(c=>c.name).join(', ') : 'Unknown',
          Plot: d.overview || 'No summary available.',
          Language: (d.spoken_languages && d.spoken_languages.map(l=>l.english_name).join(', ')) || 'Unknown',
          Country: (d.production_countries && d.production_countries.map(c=>c.name).join(', ')) || 'Unknown',
          imdbID: d.imdb_id || '',
          Poster: d.poster_path ? `https://image.tmdb.org/t/p/w780${d.poster_path}` : null,
          Ratings: []
        }
        // Get credits (because we asked above but TMDB detail request may not include credits unless appended)
        // Try to request with append_to_response=credits
        try {
          const detailRes2 = await axios.get(`${detailUrl}&append_to_response=credits`, { timeout: 10000 })
          const dd = detailRes2.data
          if (dd.credits && dd.credits.cast) {
            movie.Actors = dd.credits.cast.slice(0,6).map(c=>c.name).join(', ')
          }
          if (dd.credits && dd.credits.crew) {
            const dir = dd.credits.crew.find(c=>c.job === 'Director')
            if (dir) movie.Director = dir.name
          }
        } catch(e) {}
        poster = movie.Poster
      } else {
        return reply(`Movie එක සොයාගත නොහැක. නමින් "${query}" උත්සාහ කරන්න. වෙනත් නමක් (alternate title) උස්සා බලන්න.`)
      }
    }

    // Build caption (Sinhala-style formatted)
    const title = movie.Title || query
    const year = movie.Year || 'Unknown'
    const runtime = movie.Runtime || 'Unknown'
    const genres = movie.Genre || 'Unknown'
    const director = movie.Director || 'Unknown'
    const actors = movie.Actors || 'Unknown'
    const plot = movie.Plot || 'No description available.'
    const language = movie.Language || 'Unknown'
    const country = movie.Country || 'Unknown'
    const ratings = (movie.Ratings && movie.Ratings.length > 0) ? movie.Ratings.map(r=>`${r.Source}: ${r.Value}`).join(' | ') : ''

    const caption =
`☘️ *Tɪᴛʟᴇ* ☛ *_${title}_*

*▫️📅 𝗥ᴇʟᴇᴀꜱᴇ 𝗗ᴀᴛᴇ* ☛ *_${year}_*
*▫️🌎 𝗖ᴏᴜɴᴛʀʏ* ☛ *_${country}_*
*▫️⏱️ 𝗗ᴜʀᴀᴛɪᴏɴ* ☛ *_${runtime}_*
*▫️🎭 𝗚ᴇɴʀᴇꜱ* ☛ *_${genres}_*
*▫️👨🏻‍💼 𝗗ɪʀᴇᴄᴛᴏʀ* ☛ *_${director}_*
*▫️🕵️‍♂️ 𝗖ᴀsᴛ* ☛ *_${actors}_*

*▫️🔎 𝗟𝗮𝗻𝗴𝘂𝗮𝗴𝗲* ☛ *_${language}_*
${ratings ? `*▫️⭐ 𝗥𝗮𝘁𝗶𝗻𝗴* ☛ *_${ratings}_*\n` : ''}

*➟➟➟➟➟➟➟➟➟➟➟➟➟➟*
*▫️🔗 𝗝ᴏɪɴ* ☛ *${joinLink}*
*➟➟➟➟➟➟➟➟➟➟➟➟➟➟*

*© Powered By Hiru X Md*

*Synopsis:* ${plot}`

    // Prepare buttons (works for baileys-like API)
    const buttons = [
      { buttonId: `${config.prefix || '.'}cinesubz ${title}`, buttonText: { displayText: '🔄 دوباره' }, type: 1 },
      { buttonId: `help`, buttonText: { displayText: 'ℹ️ Help' }, type: 1 }
    ]

    // Send image + caption with buttons; if poster missing send text only
    if (poster) {
      // many WA libs accept this structure; adapt if your conn API differs
      await conn.sendMessage(from, {
        image: { url: poster },
        caption: caption,
        footer: 'Hiru X Md',
        buttons: buttons,
        headerType: 4
      }, { quoted: m })
    } else {
      await conn.sendMessage(from, {
        text: caption
      }, { quoted: m })
    }

  } catch (err) {
    console.error(err)
    try { reply('කිසිදු දෝෂයක්. සමහර වෙලාවට API/නැටවුක් සම්බන්ධතාවයක් හෝ movie එක නොමැති අවස්ථාවක් විය හැක. නැවත උත්සාහ කරන්න.') } catch (e) {}
  }
})