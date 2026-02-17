module.exports.config = {
    name: "pending",
    version: "1.0.5",
    credits: "Kawsar Ahmed",
    hasPermssion: 2,
    description: "Manage bot's waiting messages",
    commandCategory: "system",
    cooldowns: 5
};

module.exports.handleReply = async function({ api, event, handleReply }) {
    if (String(event.senderID) !== String(handleReply.author)) return;
    const { body, threadID, messageID } = event;
    var count = 0;

    if (isNaN(body) && body.indexOf("c") == 0 || body.indexOf("cancel") == 0) {
        const index = (body.slice(1, body.length)).split(/\s+/);
        for (const singleIndex of index) {
            console.log(singleIndex);
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`${singleIndex} is not a valid number`, threadID, messageID);
            
            api.removeUserFromGroup(api.getCurrentUserID(), handleReply.pending[singleIndex - 1].threadID);
            count += 1;
        }
        return api.sendMessage(`Refused ${count} thread!`, threadID, messageID);
    } else {
        const index = body.split(/\s+/);
        for (const singleIndex of index) {
            if (isNaN(singleIndex) || singleIndex <= 0 || singleIndex > handleReply.pending.length) 
                return api.sendMessage(`${singleIndex} is not a valid number`, threadID, messageID);
            
            api.sendMessage("Priyansh BoT Connected Successfully!\nUse +help for more info :>", handleReply.pending[singleIndex - 1].threadID);
            count += 1;
        }
        return api.sendMessage(`Approved successfully ${count} threads!`, threadID, messageID);
    }
}

module.exports.run = async function({ api, event }) {
    const { threadID, messageID } = event;
    const commandName = this.config.name;
    var msg = "", index = 1;

    try {
        var spam = await api.getThreadList(100, null, ["OTHER"]) || [];
        var pending = await api.getThreadList(100, null, ["PENDING"]) || [];
    } catch (e) { 
        return api.sendMessage("Can't get the pending list!", threadID, messageID);
    }

    const list = [...spam, ...pending].filter(group => group.isSubscribed && group.isGroup);

    for (const single of list) msg += `${index++}/ ${single.name}(${single.threadID})\n`;

    if (list.length != 0) {
        return api.sendMessage(`»「PENDING」«❮ The whole number of threads to approve is: ${list.length} thread ❯\n\n${msg}`, threadID, (error, info) => {
            global.client.handleReply.push({
                name: commandName,
                messageID: info.messageID,
                author: event.senderID,
                pending: list
            });
        }, messageID);
    } else {
        return api.sendMessage("「PENDING」There is no thread in the pending list", threadID, messageID);
    }
}
