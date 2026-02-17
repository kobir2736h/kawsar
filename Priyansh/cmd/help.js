module.exports.config = {
    name: "help",
    version: "1.0.2",
    hasPermssion: 0,
    credits: "Kawsar Ahmed",
    description: "Beginner's Guide",
    commandCategory: "system",
    usages: "[Name module]",
    cooldowns: 1,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 60 // Fixed time in seconds directly in code
    }
};

module.exports.handleEvent = function ({ api, event }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body == "undefined" || body.indexOf("help") != 0) return;
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);
    if (splitBody.length == 1 || !commands.has(splitBody[1].toLowerCase())) return;
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const command = commands.get(splitBody[1].toLowerCase());
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;
    
    return api.sendMessage(
        `「 ${command.config.name} 」\n${command.config.description}\n\n❯ Usage: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Category: ${command.config.commandCategory}\n❯ Waiting time: ${command.config.cooldowns} seconds(s)\n❯ Permission: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin group" : "Admin bot")}\n\n» Module code by ${command.config.credits} «`, 
        threadID, messageID
    );
}

module.exports.run = function({ api, event, args }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;
    const command = commands.get((args[0] || "").toLowerCase());
    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};
    const { autoUnsend } = global.configModule[this.config.name];
    const prefix = (threadSetting.hasOwnProperty("PREFIX")) ? threadSetting.PREFIX : global.config.PREFIX;

    if (!command) {
        const arrayInfo = [];
        const page = parseInt(args[0]) || 1;
        const numberOfOnePage = 10;
        let i = 0;
        let msg = "";

        for (var [name, value] of (commands)) {
            name += ``;
            arrayInfo.push(name);
        }

        arrayInfo.sort((a, b) => a.data - b.data);

        const startSlice = numberOfOnePage * page - numberOfOnePage;
        i = startSlice;
        const returnArray = arrayInfo.slice(startSlice, startSlice + numberOfOnePage);

        for (let item of returnArray) msg += `「 ${++i} 」${prefix}${item}\n`;

        const siu = `Command list 📄\nMade by Kawsar Ahmed 🥀\nFor More Information type /help (command name) ✨\n󰂆 󰟯 󰟰 󰟷 󰟺 󰟵 󰟫`;
        const text = `\nPage (${page}/${Math.ceil(arrayInfo.length / numberOfOnePage)})\n`;

        return api.sendMessage(siu + "\n\n" + msg + text, threadID, async (error, info) => {
            if (autoUnsend) {
                // Fixed delay time here (e.g., 60 seconds)
                await new Promise(resolve => setTimeout(resolve, 60 * 1000));
                return api.unsendMessage(info.messageID);
            } else return;
        }, event.messageID);
    }

    return api.sendMessage(
        `「 ${command.config.name} 」\n${command.config.description}\n\n❯ Usage: ${prefix}${command.config.name} ${(command.config.usages) ? command.config.usages : ""}\n❯ Category: ${command.config.commandCategory}\n❯ Waiting time: ${command.config.cooldowns} seconds(s)\n❯ Permission: ${((command.config.hasPermssion == 0) ? "User" : (command.config.hasPermssion == 1) ? "Admin group" : "Admin bot")}\n\n» Module code by ${command.config.credits} «`, 
        threadID, messageID
    );
};
