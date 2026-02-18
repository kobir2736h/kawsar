module.exports.config = {
    name: "setprefix",
    version: "1.0.1",
    hasPermssion: 2,
    credits: "Kawsar Ahmed",
    description: "Reset group prefix",
    commandCategory: "Group",
    usages: "[prefix/reset]",
    cooldowns: 5
};

module.exports.handleReaction = async function({ api, event, Threads, handleReaction }) {
    try {
        if (event.userID != handleReaction.author) return;
        const { threadID, messageID } = event;
        var data = (await Threads.getData(String(threadID))).data || {};
        data["PREFIX"] = handleReaction.PREFIX;
        await Threads.setData(threadID, { data });
        await global.data.threadData.set(String(threadID), data);
        api.unsendMessage(handleReaction.messageID);
        return api.sendMessage(`Changed prefix into: ${handleReaction.PREFIX}`, threadID, messageID);
    } catch (e) { return console.log(e) }
}

module.exports.run = async ({ api, event, args, Threads }) => {
    if (typeof args[0] == "undefined") return api.sendMessage("Prefix cannot be blank", event.threadID, event.messageID);
    let prefix = args[0].trim();
    if (!prefix) return api.sendMessage("Prefix cannot be blank", event.threadID, event.messageID);
    
    if (prefix == "reset") {
        var data = (await Threads.getData(event.threadID)).data || {};
        data["PREFIX"] = global.config.PREFIX;
        await Threads.setData(event.threadID, { data });
        await global.data.threadData.set(String(event.threadID), data);
        return api.sendMessage(`Reset prefix to: ${global.config.PREFIX}`, event.threadID, event.messageID);
    } else {
        return api.sendMessage(`Are you sure that you want to change prefix into: ${prefix}`, event.threadID, (error, info) => {
            global.client.handleReaction.push({
                name: "setprefix",
                messageID: info.messageID,
                author: event.senderID,
                PREFIX: prefix
            })
        })
    }
}
