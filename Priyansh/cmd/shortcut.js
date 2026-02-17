const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "shortcut",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Kawsar Ahmed",
    description: "Create shortcuts for quick replies",
    commandCategory: "system",
    usages: "[all/delete/empty]",
    cooldowns: 5
}

module.exports.onLoad = function () {
    try {
        const pathData = path.resolve(__dirname, "cache", "shortcutdata.json");
        if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
        if (!fs.existsSync(pathData)) fs.writeFileSync(pathData, JSON.stringify([]), "utf-8");
        const data = JSON.parse(fs.readFileSync(pathData, "utf-8"));
        if (typeof global.moduleData.shortcut == "undefined") global.moduleData.shortcut = new Map();
        for (const threadData of data) global.moduleData.shortcut.set(threadData.threadID, threadData.shortcuts);
    } catch (e) {
        console.log(e);
    }
    return;
}

module.exports.handleEvent = async function ({ event, api }) {
    const { threadID, messageID, body } = event;
    if (!global.moduleData.shortcut) global.moduleData.shortcut = new Map();
    if (!global.moduleData.shortcut.has(threadID)) return;
    const data = global.moduleData.shortcut.get(threadID);

    if (data.some(item => item.input == body)) {
        const dataThread = data.find(item => item.input == body);
        return api.sendMessage(dataThread.output, threadID, messageID);
    }
}

module.exports.handleReply = async function ({ event, api, handleReply }) {
    if (handleReply.author != event.senderID) return;
    const { threadID, messageID, senderID, body } = event;
    const name = this.config.name;

    const pathData = path.resolve(__dirname, "cache", "shortcutdata.json");

    switch (handleReply.type) {
        case "requireInput": {
            if (body.length == 0) return api.sendMessage("「Shortcut」Keyword must not be blank!", threadID, messageID);
            const data = global.moduleData.shortcut.get(threadID) || [];
            if (data.some(item => item.input == body)) return api.sendMessage("「Shortcut」Input has already existed!", threadID, messageID);
            api.unsendMessage(handleReply.messageID);
            return api.sendMessage("「Shortcut」Reply this message to import the answer when use keyword", threadID, function (error, info) {
                return global.client.handleReply.push({
                    type: "final",
                    name,
                    author: senderID,
                    messageID: info.messageID,
                    input: body
                });
            }, messageID);
        }
        case "final": {
            // Using Timestamp as Unique ID
            const id = Date.now().toString(36); 
            
            const readData = fs.readFileSync(pathData, "utf-8");
            var data = JSON.parse(readData);
            var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
            var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
            const object = { id, input: handleReply.input, output: body || "empty" };

            dataThread.shortcuts.push(object);
            dataGlobal.push(object);

            if (!data.some(item => item.threadID == threadID)) data.push(dataThread);
            else {
                const index = data.indexOf(data.find(item => item.threadID == threadID));
                data[index] = dataThread;
            }

            global.moduleData.shortcut.set(threadID, dataGlobal);
            fs.writeFileSync(pathData, JSON.stringify(data, null, 4), "utf-8");

            return api.sendMessage(`「Shortcut」Added new shortcut, here is result:\n- ID:${id}\n- Input: ${handleReply.input}\n- Output: ${body || "empty"}`, threadID, messageID);
        }
    }
}

module.exports.run = function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const name = this.config.name;

    const pathData = path.resolve(__dirname, "cache", "shortcutdata.json");

    switch (args[0]) {
        case "remove":
        case "delete":
        case "del":
        case "-d": {
            const readData = fs.readFileSync(pathData, "utf-8");
            var data = JSON.parse(readData);
            const indexData = data.findIndex(item => item.threadID == threadID);
            if (indexData == -1) return api.sendMessage("「Shortcut」Your thread have no shortcut!", threadID, messageID);
            var dataThread = data.find(item => item.threadID == threadID) || { threadID, shortcuts: [] };
            var dataGlobal = global.moduleData.shortcut.get(threadID) || [];
            var indexNeedRemove;

            if (dataThread.shortcuts.length == 0) return api.sendMessage("「Shortcut」Your thread have no shortcut!", threadID, messageID);

            if (isNaN(args[1])) indexNeedRemove = args[1];
            else indexNeedRemove = dataThread.shortcuts.findIndex(item => item.input == (args.slice(1, args.length)).join(" ") || item.id == (args.slice(1, args.length)).join(" "));

            dataThread.shortcuts.splice(indexNeedRemove, 1);
            dataGlobal.splice(indexNeedRemove, 1);

            global.moduleData.shortcut.set(threadID, dataGlobal);
            data[indexData] = dataThread;
            fs.writeFileSync(pathData, JSON.stringify(data, null, 4), "utf-8");

            return api.sendMessage("「Shortcut」Removed shortcut!", threadID, messageID);
        }

        case "list":
        case "all":
        case "-a": {
            const data = global.moduleData.shortcut.get(threadID) || [];
            var array = [];
            if (data.length == 0) return api.sendMessage("「Shortcut」Your thread have no shortcut!", threadID, messageID);
            else {
                var n = 1;
                for (const single of data) array.push(`${n++}/ ${single.input} => ${single.output}`);
                return api.sendMessage(`「Shortcut」These are shortcuts of this thread:\n[stt]/ [Input] => [Output]\n\n${array.join("\n")}`, threadID, messageID);
            }
        }

        default: {
            return api.sendMessage("「Shortcut」Reply this message to import keyword for shortcut", threadID, function (error, info) {
                return global.client.handleReply.push({
                    type: "requireInput",
                    name,
                    author: senderID,
                    messageID: info.messageID
                });
            }, messageID);
        }
    }
}
