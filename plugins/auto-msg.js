const { cmd } = require('../command');

const textCommands = [
    { pattern: "hi",       msg: "*හායි හායි ඔයා ලස්සන ළමයෝ ඔයා මොකද කරන්නේ 🥰🫶🏻........*" },
    { pattern: "gn",       msg: "*නිදාගන්නද හදන්නේ එහෙනම් Good Night🥱🫶🏻.........*" },
    { pattern: "gm",       msg: "*Good Morning ළමයෝ 🥰🫶🏻......*" },
    { pattern: "bye",      msg: "*කොහෙද යන්නේ එහෙනම් ගිහින් පරිස්සමෙන් එන්න 🥰🫶🏻..........*" },
    { pattern: "adareyi",  msg: "*ඔයා මට කොච්චර ආදරෙයිද මන්නම් ඔයාට ගොඩාක් ආදරෙයි 🫶🏻💗............*" },
    { pattern: "mk",       msg: "*මොකුත් නැ අනේ ඔයා මොකද කරන්නේ 🤔🥰........*" },
    { pattern: "ponnaya",  msg: "*තෝ නේ යකෝ පොන්නයා 😡*" },
];

// Register all text commands
for (let tc of textCommands) {
    cmd({
        pattern: tc.pattern,
        desc: `Reply for ${tc.pattern}`,
        category: "text",
        filename: __filename
    },
    async (conn, mek, m, { reply }) => {
        try {
            reply(tc.msg);
        } catch (e) {
            console.log(e);
        }
    });
}