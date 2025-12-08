const fetch = require('node-fetch');
const config = require('../config');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch GitHub repository information",
    react: "♻",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    try {
        // ✅ Random image from /Dml folder
        const scsFolder = path.join(__dirname, "../Dml");
        const images = fs.readdirSync(scsFolder).filter(f => /^menu\d+\.jpg$/i.test(f));
        const randomImage = images[Math.floor(Math.random() * images.length)];
        const imagePath = path.join(scsFolder, randomImage);

        const githubRepoURL = 'https://github.com/MLILA17/DML-MD';

        const match = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);
        if (!match) return reply("❌ Error: Invalid repository URL.");

        const [, username, repoName] = match;

        const response = await fetch(
            `https://api.github.com/repos/${username}/${repoName}`,
            {
                headers: { 'User-Agent': 'DML-MD' }
            }
        );

        if (response.status === 503) {
            return reply("❌ GitHub is temporarily unavailable (503). Try again later.");
        }

        if (!response.ok) {
            return reply(`❌ Failed to fetch repository info. Status code: ${response.status}`);
        }

        const repoData = await response.json();

        const message = `╭───────⧼ DML-MD REPO SYSTEM ⧽
│
│ ♢ *Repository:* ${repoData.name}
│ ♢ *Owner:* ${repoData.owner.login}
│ ♢ *Stars:* ${repoData.stargazers_count} ⭐
│ ♢ *Forks:* ${repoData.forks_count} 🍴
│ ♢ *URL:* ${repoData.html_url}
│
│ ♢ *Description:*
│ ${repoData.description || 'No description provided.'}
│
╰─────────────────────────
> ${config.DESCRIPTION}`;

        await conn.sendMessage(from, {
            image: { url: `https://url.bwmxmd.online/Adams.t2dpkvu3.jpg` },
            // ✅ if you want to use local image instead, replace above line with:
            // image: fs.readFileSync(imagePath),
            caption: message,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363403958418756@newsletter',
                    newsletterName: config.OWNER_NAME || 'DML-MD',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo command error:", error);
        reply("❌ An error occurred while fetching the repository.");
    }
});
