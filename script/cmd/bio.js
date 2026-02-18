module.exports.config = {
    name: "bio",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kawsar Ahmed",
    description: "Change bot's bio",
    commandCategory: "admin",
    usages: "bio [text]",
    cooldowns: 5
}

module.exports.run = async ({ api, event, args }) => {
    if (args.length === 0) return api.sendMessage("Please enter a bio text!", event.threadID, event.messageID);
    
    const newBio = args.join(" ");
    
    api.changeBio(newBio, (e) => {
        if (e) return api.sendMessage("An error occurred: " + e, event.threadID);
        return api.sendMessage("Changed the biography of the bot to:\n" + newBio, event.threadID, event.messageID);
    });
}
