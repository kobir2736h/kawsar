const fs = require("fs");
const path = require("path");

module.exports.config = {
    name: "admin",
    version: "1.0.5",
    hasPermssion: 0,
    credits: "Kawsar Ahmed",
    description: "Admin Config",
    commandCategory: "Admin",
    usages: "Admin",
    cooldowns: 2
};

module.exports.onLoad = function() {
    const pathData = path.resolve(__dirname, 'cache', 'data.json');
    if (!fs.existsSync(pathData)) {
        const obj = {
            adminbox: {}
        };
        fs.writeFileSync(pathData, JSON.stringify(obj, null, 4));
    } else {
        const data = require(pathData);
        if (!data.hasOwnProperty('adminbox')) data.adminbox = {};
        fs.writeFileSync(pathData, JSON.stringify(data, null, 4));
    }
}

module.exports.run = async function ({ api, event, args, Users, permssion }) {
    const content = args.slice(1, args.length);
    if (args.length == 0) return api.sendMessage({body:`==== [ 𝗔𝗗𝗠𝗜𝗡 𝗦𝗘𝗧𝗧𝗜𝗡𝗚 ] ====\n━━━━━━━━━━━━━━━\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗹𝗶𝘀𝘁 => 𝗩𝗶𝗲𝘄 𝗹𝗶𝘀𝘁 𝗼𝗳 𝗔𝗱𝗺𝗶𝗻 𝗮𝗻𝗱 𝗦𝘂𝗽𝗽𝗼𝗿𝘁\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗮𝗱𝗱 => 𝗔𝗱𝗱 𝘂𝘀𝗲𝗿 𝗮𝘀 𝗔𝗱𝗺𝗶𝗻\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗿𝗲𝗺𝗼𝘃𝗲=> 𝗥𝗲𝗺𝗼𝘃𝗲 𝗿𝗼𝗹𝗲 𝗔𝗱𝗺𝗶𝗻\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗮𝗱𝗱𝗻𝗱𝗵 => 𝗔𝗱𝗱 𝘂𝘀𝗲𝗿 𝗮𝘀 𝗦𝘂𝗽𝗽𝗼𝗿𝘁\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗿𝗲𝗺𝗼𝘃𝗲𝗻𝗱𝗵=> 𝗥𝗲𝗺𝗼𝘃𝗲 𝗿𝗼𝗹𝗲 𝗦𝘂𝗽𝗽𝗼𝗿𝘁\n𝗠𝗢𝗗𝗘 -𝗮𝗱𝗺𝗶𝗻 𝗾𝘁𝘃𝗼𝗻𝗹𝘆=> 𝘁𝗼𝗴𝗴𝗹𝗲  𝗺𝗼𝗱𝗲 𝗼𝗻𝗹𝘆 𝗮𝗱𝗺𝗶𝗻𝘀 𝘂𝘀𝗲 𝗯𝗼𝘁\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗻𝗱𝗵𝗼𝗻𝗹𝘆=> 𝘁𝗼𝗴𝗴𝗹𝗲 𝗺𝗼𝗱𝗲 𝗼𝗻𝗹𝘆 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 𝗯𝗼𝘁 𝘂𝘀𝗶𝗻𝗴 𝗯𝗼𝘁\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗼𝗻𝗹𝘆 => 𝘁𝗼𝗴𝗴𝗹𝗲 𝗺𝗼𝗱𝗲 𝗼𝗻𝗹𝘆 𝗮𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗯𝗼𝘁\n𝗠𝗢𝗗𝗘 - 𝗮𝗱𝗺𝗶𝗻 𝗶𝗯𝗼𝗻𝗹𝘆 => 𝘁𝗼𝗴𝗴𝗹𝗲 𝗺𝗼𝗱 𝗼𝗻𝗹𝘆 𝗮𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗯𝗼𝘁𝘀 𝗶𝗻 𝗶𝗯 𝘀𝗲𝗽𝗮𝗿𝗮𝘁𝗲𝗹𝘆 𝗳𝗿𝗼𝗺 𝗯𝗼𝘁𝘀\n━━━━━━━━━━━━━━━\n𝗛𝗗𝗦𝗗 => ${global.config.PREFIX}𝗮𝗱𝗺𝗶𝗻 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝘁𝗼 𝘂𝘀𝗲`}, event.threadID, event.messageID);
    
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { ADMINBOT } = global.config;
    const { NDH } = global.config;
    const mention = Object.keys(mentions);

    // Reload config
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);

    switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
            listAdmin = ADMINBOT || config.ADMINBOT ||  [];
            var msg = [];
            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                    const name = (await Users.getData(idAdmin)).name
                    msg.push(`𝗧𝗲̂𝗻: ${name}\n» 𝗟𝗶𝗻𝗸 𝗙𝗕: https://www.facebook.com/${idAdmin} 💌`);
                }
            }
            listNDH = NDH || config.NDH ||  [];
            var msg1 = [];
            for (const idNDH of listNDH) {
                if (parseInt(idNDH)) {
                    const name1 = (await Users.getData(idNDH)).name
                    msg1.push(`𝗧𝗲̂𝗻: ${name1}\n» 𝗟𝗶𝗻𝗸 𝗙𝗕: https://www.facebook.com/${idNDH} 🤖`);
                }
            }

            return api.sendMessage(`[Admin] Admin list: \n\n${msg.join("\n\n")}\n\n[Admin] Support list: \n\n${msg1.join("\n\n")}`, threadID, messageID);
        }

        case "add": {
            if (permssion != 3) return api.sendMessage('[Admin] You have no permission to use "add"', threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    ADMINBOT.push(id);
                    config.ADMINBOT.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Added ${mention.length} Admin :\n\n${listAdd.join("\n").replace(/\@/g, "")}`, threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                ADMINBOT.push(content[0]);
                config.ADMINBOT.push(content[0]);
                const name = (await Users.getData(content[0])).name
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Added 1 Admin :\n\n𝗔𝗱𝗺𝗶𝗻 - ${name}`, threadID, messageID);
            }
            else return api.sendMessage(`[Admin] Invalid usage`, threadID, messageID);
        }

        case "addndh": {
            if (permssion != 3) return api.sendMessage('[Admin] You have no permission to use "addndh"', threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];
                for (const id of mention) {
                    NDH.push(id);
                    config.NDH.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Added ${mention.length} Support :\n\n${listAdd.join("\n").replace(/\@/g, "")}`, threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                NDH.push(content[0]);
                config.NDH.push(content[0]);
                const name = (await Users.getData(content[0])).name
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Added 1 Support :\n\n𝗦𝘂𝗽𝗽𝗼𝗿𝘁𝗲𝗿𝘀 - ${name}`, threadID, messageID);
            }
            else return api.sendMessage(`[Admin] Invalid usage`, threadID, messageID);
        }

        case "remove":
        case "rm":
        case "delete": {
            if (permssion != 3) return api.sendMessage('[Admin] You have no permission to use "delete"', threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.ADMINBOT.findIndex(item => item == id);
                    ADMINBOT.splice(index, 1);
                    config.ADMINBOT.splice(index, 1);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Removed ${mention.length} Admin:\n\n${listAdd.join("\n").replace(/\@/g, "")}`, threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.ADMINBOT.findIndex(item => item.toString() == content[0]);
                ADMINBOT.splice(index, 1);
                config.ADMINBOT.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Removed 1 Admin:\n\n${content[0]} - ${name}`, threadID, messageID);
            }
            else return api.sendMessage(`[Admin] Invalid usage`, threadID, messageID);
        }

        case "removendh": {
            if (permssion != 3) return api.sendMessage('[Admin] You have no permission to use "removendh"', threadID, messageID);
            if(event.type == "message_reply") { content[0] = event.messageReply.senderID }
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.NDH.findIndex(item => item == id);
                    NDH.splice(index, 1);
                    config.NDH.splice(index, 1);
                    listAdd.push(`${id} -${event.mentions[id]}`);
                };

                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Removed ${mention.length} Support:\n\n${listAdd.join("\n").replace(/\@/g, "")}`, threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.NDH.findIndex(item => item.toString() == content[0]);
                NDH.splice(index, 1);
                config.NDH.splice(index, 1);
                const name = (await Users.getData(content[0])).name
                fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(`[Admin] Removed 1 Support:\n\n${content[0]} - ${name}`, threadID, messageID);
            }
            else return api.sendMessage(`[Admin] Invalid usage`, threadID, messageID);
        }

        case 'qtvonly': {
            const pathData = path.resolve(__dirname, 'cache', 'data.json');
            const database = require(pathData);
            const { adminbox } = database;
            if (permssion < 1) return api.sendMessage("𝗠𝗢𝗗𝗘 - 𝗕𝗼𝗿𝗱𝗲𝗿 𝗰𝗮𝗻𝗴𝗹𝗲 𝗿𝗶𝗴𝗵𝘁𝘀 🎀 ", threadID, messageID);
            if (adminbox[threadID] == true) {
                adminbox[threadID] = false;
                api.sendMessage("𝗠𝗢𝗗𝗘 » 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗤𝗧𝗩 𝗺𝗼𝗱𝗲 𝗼𝗻𝗹𝘆 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗲 𝗯𝗼𝘁 👀", threadID, messageID);
            } else {
                adminbox[threadID] = true;
                api.sendMessage("𝗠𝗢𝗗𝗘 » 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗲𝗻𝗮𝗯𝗹𝗲 𝗤𝗧𝗩 𝗼𝗻𝗹𝘆 𝗺𝗼𝗱𝗲, 𝗼𝗻𝗹𝘆 𝗮𝗱𝗺𝗶𝗻𝗶𝘀𝘁𝗿𝗮𝘁𝗼𝗿𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗯𝗼𝘁𝘀 👀", threadID, messageID);
            }
            fs.writeFileSync(pathData, JSON.stringify(database, null, 4));
            break;
        }

        case 'ndhonly':
        case '-ndh': {
            if (permssion < 2) return api.sendMessage("𝗠𝗢𝗗𝗘 - 𝗕𝗼𝗿𝗱𝗲𝗿 𝗰𝗮𝗻𝗴𝗹𝗲 𝗿𝗶𝗴𝗵𝘁𝘀 🎀 ", threadID, messageID);
            if (config.ndhOnly == false) {
                config.ndhOnly = true;
                api.sendMessage(`𝗠𝗢𝗗𝗘 » 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗲𝗻𝗮𝗯𝗹𝗲 𝗡𝗗𝗛 𝗢𝗻𝗹𝘆 𝗺𝗼𝗱𝗲, 𝗼𝗻𝗹𝘆 𝗯𝗼𝘁 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗯𝗼𝘁 👾`, threadID, messageID);
            } else {
                config.ndhOnly = false;
                api.sendMessage(`𝗠𝗢𝗗𝗘 » 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗡𝗗𝗛 𝗢𝗻𝗹𝘆 𝗺𝗼𝗱𝗲, 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗲 𝗯𝗼𝘁 👾`, threadID, messageID);
            }
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }

        case 'ibonly': {
            if (permssion != 3) return api.sendMessage("𝗠𝗢𝗗𝗘 - 𝗕𝗼𝗿𝗱𝗲𝗿 𝗰𝗮𝗻𝗴𝗹𝗲 𝗿𝗶𝗴𝗵𝘁𝘀 🎀", threadID, messageID);
            if (config.adminPaOnly == false) {
                config.adminPaOnly = true;
                api.sendMessage("𝗠𝗢𝗗𝗘 » 𝗜𝗯 𝗢𝗻𝗹𝘆 𝗺𝗼𝗱𝗲 𝗶𝘀 𝘀𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗲𝗻𝗮𝗯𝗹𝗲𝗱, 𝗼𝗻𝗹𝘆 𝗮𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗯𝗼𝘁𝘀 𝗶𝗻 𝘁𝗵𝗲𝗶𝗿 𝗼𝘄𝗻 𝗶𝗻𝗯𝗼𝘅 💬", threadID, messageID);
            } else {
                config.adminPaOnly = false;
                api.sendMessage("[ 𝐌𝐎𝐃𝐄 ] » 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗜𝗯 𝗢𝗻𝗹𝘆 𝗺𝗼𝗱𝗲, 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗶𝗻 𝘁𝗵𝗲𝗶𝗿 𝗼𝘄𝗻 𝗶𝗻𝗯𝗼𝘅 💬", threadID, messageID);
            }
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }

        case 'only':
        case '-o': {
            if (permssion != 3) return api.sendMessage("𝗠𝗢𝗗𝗘 - 𝗕𝗼𝗿𝗱𝗲𝗿 𝗰𝗮𝗻𝗴𝗹𝗲 𝗿𝗶𝗴𝗵𝘁𝘀 🎀 ", threadID, messageID);
            if (config.adminOnly == false) {
                config.adminOnly = true;
                api.sendMessage(`𝗠𝗢𝗗𝗘 - 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗲𝗻𝗮𝗯𝗹𝗲 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆 𝗺𝗼𝗱𝗲, 𝗼𝗻𝗹𝘆 𝗮𝗱𝗺𝗶𝗻𝘀 𝗰𝗮𝗻 𝘂𝘀𝗲 𝗯𝗼𝘁𝘀 👑`, threadID, messageID);
            } else {
                config.adminOnly = false;
                api.sendMessage(`𝗠𝗢𝗗𝗘 - 𝗦𝘂𝗰𝗰𝗲𝘀𝘀𝗳𝘂𝗹𝗹𝘆 𝗱𝗶𝘀𝗮𝗯𝗹𝗲 𝗔𝗱𝗺𝗶𝗻 𝗢𝗻𝗹𝘆 𝗺𝗼𝗱𝗲, 𝗲𝘃𝗲𝗿𝘆𝗼𝗻𝗲 𝗰𝗮𝗻 𝘂𝘀𝗲 𝘁𝗵𝗲 𝗯𝗼𝘁 👑`, threadID, messageID);
            }
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
            break;
        }

        default: {
            return api.sendMessage(`[Admin] Invalid usage. Use: ${global.config.PREFIX}admin`, threadID, messageID);
        }
    };
}
