const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363419192353625@newsletter',
            newsletterName: '𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'
];

const icons = {
    welcome: ['👋', '🙏', '🎉', '🫡'],
    goodbye: ['😔', '💔', '😢', '👋'],
    promote: ['🔺', '⭐', '🎖️', '🆙'],
    demote: ['🔻', '⚠️', '❌', '🛑']
};

const getRandomIcon = (type) => {
    return icons[type][Math.floor(Math.random() * icons[type].length)];
};

const formatTimestamp = () => {
    return new Date().toLocaleString('en-GB', { timeZone: 'Asia/Colombo' });
};

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description Provided";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[0];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = formatTimestamp();

            if (update.action === "add" && config.WELCOME === "true") {
                const icon = getRandomIcon("welcome");
                const WelcomeText = `${icon} *WELCOME @${userName}* ${icon}\n\n` +
                    `🎉 *Group:* ${metadata.subject}\n` +
                    `👥 *Member Count:* ${groupMembersCount}\n` +
                    `🕒 *Joined:* ${timestamp}\n\n` +
                    `📝 *Description:*\n${desc}\n\n` +
                    `⚡ _Powered by 𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭_`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const icon = getRandomIcon("goodbye");
                const GoodbyeText = `${icon} *GOODBYE @${userName}* ${icon}\n\n` +
                    `📤 *Left:* ${timestamp}\n` +
                    `👥 *Members Remaining:* ${groupMembersCount}\n\n` +
                    `🫠 Hope to see you again!\n\n` +
                    `⚡ _Powered by 𝗛𝗜𝗥𝗨 𝗫 𝗠𝗗 𝗩𝟭_`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const icon = getRandomIcon("demote");
                const demoter = update.author.split("@")[0];
                const msg = `${icon} *ADMIN UPDATE* ${icon}\n\n` +
                    `🔻 @${userName} was *demoted* by @${demoter}.\n` +
                    `🕒 Time: ${timestamp}\n` +
                    `👥 Group: ${metadata.subject}`;

                await conn.sendMessage(update.id, {
                    text: msg,
                    mentions: [num, update.author],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const icon = getRandomIcon("promote");
                const promoter = update.author.split("@")[0];
                const msg = `${icon} *ADMIN UPDATE* ${icon}\n\n` +
                    `🔺 @${userName} was *promoted* by @${promoter}.\n` +
                    `🕒 Time: ${timestamp}\n` +
                    `👥 Group: ${metadata.subject}`;

                await conn.sendMessage(update.id, {
                    text: msg,
                    mentions: [num, update.author],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
