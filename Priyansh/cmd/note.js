const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "note",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Kawsar Ahmed",
    description: "Customize notes for each group",
    commandCategory: "Box chat",
    usages: "[add/remove/all] [note]",
    cooldowns: 5
}

module.exports.onLoad = () => {
    const pathData = path.join(__dirname, "cache", "notes.json");
    if (!fs.existsSync(pathData)) return fs.writeFileSync(pathData, "[]", "utf-8");
}

module.exports.run = ({ event, api, args, permssion }) => {
    const { threadID, messageID } = event;
    const pathData = path.join(__dirname, "cache", "notes.json");
    const content = (args.slice(1, args.length)).join(" ");
    
    // Read file using fs
    var dataJson = JSON.parse(fs.readFileSync(pathData, "utf-8"));
    var thisThread = dataJson.find(item => item.threadID == threadID) || { threadID, listRule: [] };

    switch (args[0]) {
        case "add": {
            if (permssion == 0) return api.sendMessage("[Note] You do not have enough powers to be able to use more notes with only administrators to be used!", threadID, messageID);
            if (content.length == 0) return api.sendMessage("[Note] Insert information cannot be left blank", threadID, messageID);
            if (content.indexOf("\n") != -1) {
                const contentSplit = content.split("\n");
                for (const item of contentSplit) thisThread.listRule.push(item);
            }
            else {
                thisThread.listRule.push(content);
            }
            fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
            api.sendMessage('[Note] Added new notes to the team successfully!', threadID, messageID);
            break;
        }
        case "list":
        case "all": {
            var msg = "", index = 0;
            for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
            if (msg.length == 0) return api.sendMessage("[Note] Your team does not have a list of notes to display!", threadID, messageID);
            api.sendMessage(`Notes of the group are:\n\n${msg}`, threadID, messageID);
            break;
        }
        case "rm":
        case "remove":
        case "delete": {
            if (!isNaN(content) && content > 0) {
                if (permssion == 0) return api.sendMessage("[Note] You do not have enough powers to be able to use the notes that only administrators are used!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("[Note] Your team does not have a list of notes to be able to delete!", threadID, messageID);
                thisThread.listRule.splice(content - 1, 1);
                api.sendMessage(`[Note] Has successfully deleted note number ${content}`, threadID, messageID);
                break;
            }
            else if (content == "all") {
                if (permssion == 0) return api.sendMessage("[Note] You do not have enough powers to be able to use the notes that only administrators are used!", threadID, messageID);
                if (thisThread.listRule.length == 0) return api.sendMessage("[Note] Your team does not have a list of notes to be able to delete!", threadID, messageID);
                thisThread.listRule = [];
                api.sendMessage(`[Note] Has successfully deleted the entire group's notes!`, threadID, messageID);
                break;
            }
        }
        default: {
            if (thisThread.listRule.length != 0) {
                var msg = "", index = 0;
                for (const item of thisThread.listRule) msg += `${index+=1}/ ${item}\n`;
                return api.sendMessage(`Notes of the group are:\n\n${msg}`, threadID, messageID);
            }
            else return api.sendMessage(`[Note] Invalid usage. Use: ${global.config.PREFIX}note [add/remove/all]`, threadID, messageID);
        }
    }

    if (!dataJson.some(item => item.threadID == threadID)) dataJson.push(thisThread);
    return fs.writeFileSync(pathData, JSON.stringify(dataJson, null, 4), "utf-8");
}
