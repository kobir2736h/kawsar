const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports.config = {
    name: 'say',
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Kawsar Ahmed",
    description: "Make the bot return google's audio file via text",
    commandCategory: "media",
    usages: "[bn] [Text]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    try {
        var content = event.type == "message_reply" ? event.messageReply.body : args.join(" ");
        var languageToSay = "bn"; // Fixed to Bengali as per command name 'x' (likely for Bangla TTS)
        var msg = content;

        // Path to save the audio file
        const filePath = path.resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);

        // Ensure cache directory exists
        const cacheDir = path.join(__dirname, 'cache');
        if (!fs.existsSync(cacheDir)) {
            fs.mkdirSync(cacheDir, { recursive: true });
        }

        const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(msg)}&tl=${languageToSay}&client=tw-ob`;

        // Download using axios stream
        const response = await axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });

        return api.sendMessage({
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);

    } catch (e) {
        return console.log(e);
    }
};
