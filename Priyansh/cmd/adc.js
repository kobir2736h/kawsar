const axios = require('axios');
const fs = require('fs');
const { PasteClient } = require('pastebin-api');

module.exports.config = {
    name: "adc",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kawsar Ahmed",
    description: "Apply code from pastebin or upload code to pastebin",
    commandCategory: "Admin",
    usages: "[reply link] [filename] OR [filename] (to upload)",
    cooldowns: 0,
    dependencies: {
        "pastebin-api": ""
    }
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, messageReply, type } = event;
    const name = args[0];
    let text;

    // Pastebin API Key (You can change this if needed)
    const client = new PasteClient("R02n6-lNPJqKQCd5VtL4bKPjuK6ARhHb");

    if (type == "message_reply") {
        text = messageReply.body;
    }

    if (!text && !name) return api.sendMessage('Please reply to a link or provide a command name.', threadID, messageID);

    // ==========================================
    // 1. Upload Code to Pastebin (Read Local File)
    // ==========================================
    if (!text && name) {
        fs.readFile(`${__dirname}/${name}.js`, "utf-8", async (err, data) => {
            if (err) return api.sendMessage(`Command '${name}.js' not found in bot commands folder.`, threadID, messageID);
            
            try {
                const url = await client.createPaste({
                    code: data,
                    expireDate: 'N',
                    format: "javascript",
                    name: name,
                    publicity: 1
                });
                
                // Get raw link
                // Pastebin API returns link like: https://pastebin.com/AbCdEf
                // Raw link: https://pastebin.com/raw/AbCdEf
                const id = url.split('/').pop();
                const rawLink = `https://pastebin.com/raw/${id}`;
                
                return api.sendMessage(`✅ Code uploaded successfully:\n${rawLink}`, threadID, messageID);
            } catch (e) {
                return api.sendMessage(`Error uploading to Pastebin: ${e.message}`, threadID, messageID);
            }
        });
        return;
    }

    // ==========================================
    // 2. Download Code from Link (Pastebin/Raw)
    // ==========================================
    
    // URL Detection Regex
    var urlR = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    var urlMatch = text.match(urlR);

    if (!urlMatch) return api.sendMessage('No valid link found in the reply.', threadID, messageID);

    const url = urlMatch[0];

    // Handle Pastebin Links
    if (url.indexOf('pastebin') !== -1) {
        // Convert to raw link if not already
        let rawLink = url;
        if (!rawLink.includes('/raw/')) {
            rawLink = rawLink.replace('pastebin.com/', 'pastebin.com/raw/');
        }

        try {
            const response = await axios.get(rawLink);
            const data = response.data;
            
            fs.writeFile(`${__dirname}/${name}.js`, data, "utf-8", (err) => {
                if (err) return api.sendMessage(`Failed to save code to ${name}.js`, threadID, messageID);
                api.sendMessage(`✅ Code applied to '${name}.js' successfully.\nUse reload command to activate.`, threadID, messageID);
            });
        } catch (e) {
            return api.sendMessage(`Error fetching from Pastebin: ${e.message}`, threadID, messageID);
        }
    } 
    // Handle Other Raw Links
    else {
        try {
            const response = await axios.get(url);
            const data = typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
            
            fs.writeFile(`${__dirname}/${name}.js`, data, "utf-8", (err) => {
                if (err) return api.sendMessage(`Failed to save code.`, threadID, messageID);
                api.sendMessage(`✅ Code applied to '${name}.js' successfully.`, threadID, messageID);
            });
        } catch (e) {
            return api.sendMessage(`Error fetching link: ${e.message}`, threadID, messageID);
        }
    }
}
