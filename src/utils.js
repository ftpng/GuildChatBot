const fetch = require("node-fetch");

function send_webhook_message(
    url, username, content = null, embeds = null, avatarURL = null, method = "POST"
) {
    fetch(url, {
        body: JSON.stringify({
            username: username,
            content: content != null ? content : null,
            embeds: embeds != null ? embeds : null,
            avatar_url: avatarURL != null ? avatarURL : null
        }),
        headers: {
            "Content-Type": "application/json",
        },
        method: method,
        })
        .catch(function (res) {
            console.log(res);
        });
}

function parseGuildChat(message) {
    const guildChatRegex = /^Guild > (?:\[([^\]]+)\] )?([^:]+): (.+)$/;
    const match = message.match(guildChatRegex);
    
    if (!match) return null;
    const [, rank, name, content] = match;
    return {
        rank,
        name,
        content,
        displayName: rank ? `[${rank}] ${name}` : name,
        avatarURL: `https://mc-heads.net/avatar/${encodeURIComponent(name)}`
    };
}

function sendGuildChatToDiscord(discordWebhookUrl, guildData) {
    if (!discordWebhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set.');
        return;
    }
    send_webhook_message(
        discordWebhookUrl,
        guildData.displayName,
        guildData.content,
        null,
        guildData.avatarURL
    );
}

function sendMessageToDiscord(discordWebhookUrl, content) {
    if (!discordWebhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set.');
        return;
    }
    send_webhook_message(
        discordWebhookUrl,
        'In Game Chat', 
        content,
        null, 
        null
    );
}

function stripMinecraftFormatting(message) {
    return message.replace(/§[0-9a-fklmnor]/gi, '');
}

exports.send_webhook_message = send_webhook_message;
exports.parseGuildChat = parseGuildChat;
exports.sendGuildChatToDiscord = sendGuildChatToDiscord;
exports.sendMessageToDiscord = sendMessageToDiscord;
exports.stripMinecraftFormatting = stripMinecraftFormatting; 