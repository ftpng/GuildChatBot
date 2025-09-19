# GuildChatBot
This project connects a Minecraft bot to a Discord webhook.
It listens for guild chat messages and events in Minecraft and forwards them to a specified Discord channel.
It also allows sending messages from Discord (or any WebSocket client) back into Minecraft guild chat.

# Features
- Logs in to a Minecraft server using Microsoft authentication.
- Detects guild chat messages (`Guild > [Rank] Username: message`) and sends them to Discord.
- Posts guild join/leave/kick messages to Discord.
- Formats usernames with ranks and uses Minecraft avatars as Discord webhook icons.
- Provides a WebSocket API (`ws://localhost:8080`) for sending messages into guild chat.

# Installation
### 1. Clone this repository
```bash
git clone https://github.com/ftpng/GuildChatBot.git
cd GuildChatBot
``` 

### 2. Install dependencies
```bash
npm install
```

Dependencies:
- mineflayer (Minecraft bot framework)
- dotenv (loads environment variables)
- node-fetch (for Discord webhooks)
- ws (WebSocket server)

### 3. Configure environment variables
Create a .env file in the project root:

```env
MINECRAFT_EMAIL=your_microsoft_email
MINECRAFT_PASSWORD=your_microsoft_password
MINECRAFT_SERVER=your_minecraft_server
MINECRAFT_PORT=25565
DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/your_webhook_id
```

Note: If you’re using Microsoft authentication, the password may not be needed (depending on your account setup).

### 4. Run the bot
```bash
node bot.js
```

# Support
If you run into any issues, bugs, or have other questions, feel free to DM me on Discord `@ventros.` thanks!
