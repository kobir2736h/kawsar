module.exports.config = {
    name: "getlink",
    version: "1.0.1",
    hasPermssion: 0,
    credits: "Kawsar Ahmed",
    description: "Get the URL Download from Video, Audio is sent from the group",
    commandCategory: "Tool",
    usages: "getLink",
    cooldowns: 5,
};

module.exports.run = async ({ api, event }) => {
    if (event.type !== "message_reply") 
        return api.sendMessage("❌ Your need reply a message have contain an audio, video or picture", event.threadID, event.messageID);
        
    if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) 
        return api.sendMessage("❌ Your need reply a message have contain an audio, video or picture", event.threadID, event.messageID);
        
    if (event.messageReply.attachments.length > 1) 
        return api.sendMessage("❌ Your need reply a message have contain an audio, video or picture", event.threadID, event.messageID);
        
    return api.sendMessage(event.messageReply.attachments[0].url, event.threadID, event.messageID);
}
