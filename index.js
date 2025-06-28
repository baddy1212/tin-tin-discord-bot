const { Client, GatewayIntentBits } = require('discord.js');
const Parser = require('rss-parser');
require('dotenv').config();

const parser = new Parser();
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const FEED_URLS = [
  'https://www.facebook.com/feeds/page.php?format=rss20&id=100080057666767',
  'https://www.facebook.com/feeds/page.php?format=rss20&id=100069153349307'
];

const CHANNEL_ID = '1387726802297819230'; // ID kênh #chung trong server Tin Tin
let lastGuids = {};

async function checkFeeds() {
  for (const url of FEED_URLS) {
    try {
      const feed = await parser.parseURL(url);
      const latest = feed.items[0];
      if (!lastGuids[url]) lastGuids[url] = latest.guid;
      if (latest.guid !== lastGuids[url]) {
        lastGuids[url] = latest.guid;
        const channel = await client.channels.fetch(CHANNEL_ID);
        if (channel) {
          channel.send(`🆕 Fanpage mới đăng bài: ${latest.title}\n👉 ${latest.link}`);
        }
      }
    } catch (err) {
      console.error(`Lỗi đọc feed ${url}:`, err.message);
    }
  }
}

client.once('ready', () => {
  console.log(`✅ Bot đang chạy dưới tên ${client.user.tag}`);
  setInterval(checkFeeds, 3 * 60 * 1000); // mỗi 3 phút
});

client.login(process.env.DISCORD_TOKEN);
