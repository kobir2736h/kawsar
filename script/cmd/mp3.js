const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "mp3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kawsar Ahmed",
  description: "Convert MP4 video to MP3",
  commandCategory: "media",
  usages: "mp3 (reply to video)",
  cooldowns: 5
};

module.exports.run = async function ({ api, args, event }) {
  try {
    const cacheDir = path.join(__dirname, "cache");
    const filePath = path.join(cacheDir, "vdtoau.m4a");

    // Ensure cache directory exists
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    let videoUrl;
    if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
      videoUrl = event.messageReply.attachments[0].url;
    } else if (args.length > 0) {
      videoUrl = args.join(" ");
    } else {
      return api.sendMessage("❌ Please reply to a video or provide a URL.", event.threadID, event.messageID);
    }

    const { data } = await axios.get(videoUrl, {
      method: "GET",
      responseType: "arraybuffer"
    });

    fs.writeFileSync(filePath, Buffer.from(data));

    const msg = {
      body: "𝗖𝗼𝗻𝘃𝗲𝗿𝘁𝗲𝗱 𝘁𝗼 𝗠𝗣𝟯 🎼\n•┄┅════❁🌺❁════┅┄•",
      attachment: fs.createReadStream(filePath)
    };

    api.sendMessage(msg, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

  } catch (error) {
    console.error(error);
    api.sendMessage("❌ Error converting video to audio.", event.threadID, event.messageID);
  }
};
