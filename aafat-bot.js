import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

// Load config from environment variables
const BOT_TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;
const ROLE_WHITELISTED = process.env.ROLE_WHITELISTED;
const ROLE_REJECTED = process.env.ROLE_REJECTED;

app.get("/", (req, res) => {
  res.send("✅ Aafat Whitelist Bot is running!");
});

app.post("/assign-role", async (req, res) => {
  const { discordId, whitelisted } = req.body;
  if (!discordId) return res.status(400).json({ error: "Missing discordId" });

  const roleId = whitelisted ? ROLE_WHITELISTED : ROLE_REJECTED;
  const url = `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordId}/roles/${roleId}`;

  try {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Authorization": `Bot ${BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      console.log(`✅ Gave ${whitelisted ? "Whitelisted" : "Rejected"} role to ${discordId}`);
      return res.json({ success: true });
    } else {
      const err = await response.text();
      console.error("❌ Discord API Error:", err);
      return res.status(500).json({ error: err });
    }
  } catch (error) {
    console.error("⚠️ Error assigning role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Bot server is running on port ${PORT}`));