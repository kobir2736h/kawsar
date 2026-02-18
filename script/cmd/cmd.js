const { execSync } = require("child_process");
const { writeFileSync, unlinkSync, readFileSync, readdirSync } = require("fs-extra");
const { join } = require("path");

module.exports.config = {
    name: "cmd",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "Kawsar Ahmed",
    description: "Manage/Control all bot modules",
    commandCategory: "System",
    usages: "[load/unload/loadAll/unloadAll] [name module]",
    cooldowns: 2
};

const loadCommand = function ({ moduleList, threadID, messageID }) {
    const { configPath, mainPath, api } = global.client;
    
    let errorList = [];

    delete require.cache[require.resolve(configPath)];
    let configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 2), "utf8");

    for (const nameModule of moduleList) {
        try {
            const dirModule = __dirname + "/" + nameModule + ".js";
            delete require.cache[require.resolve(dirModule)];
            const command = require(dirModule);
            global.client.commands.delete(nameModule);

            if (!command.config || !command.run || !command.config.commandCategory) {
                throw new Error("[CMD] - Module is not properly formatted!");
            }

            global.client.eventRegistered = global.client.eventRegistered.filter(info => info !== command.config.name);

            if (command.config.envConfig && typeof command.config.envConfig === "object") {
                try {
                    for (const [key, value] of Object.entries(command.config.envConfig)) {
                        if (typeof global.configModule[command.config.name] === "undefined")
                            global.configModule[command.config.name] = {};
                        if (typeof configValue[command.config.name] === "undefined")
                            configValue[command.config.name] = {};
                        if (typeof configValue[command.config.name][key] !== "undefined")
                            global.configModule[command.config.name][key] = configValue[command.config.name][key];
                        else
                            global.configModule[command.config.name][key] = value || "";

                        if (typeof configValue[command.config.name][key] === "undefined")
                            configValue[command.config.name][key] = value || "";
                    }

                    console.log(`[ CMD ] Loaded config for ${command.config.name}`);
                } catch (error) {
                    throw new Error(`[CMD] » Could not load config module: ${JSON.stringify(error)}`);
                }
            }

            if (typeof command.onLoad === "function") {
                try {
                    command.onLoad({ configValue });
                } catch (error) {
                    throw new Error(`[CMD] » onLoad error in module ${command.config.name}: ${JSON.stringify(error)}`);
                }
            }

            if (typeof command.handleEvent === "function") {
                global.client.eventRegistered.push(command.config.name);
            }

            if (global.config.commandDisabled.includes(nameModule + ".js")) {
                global.config.commandDisabled.splice(global.config.commandDisabled.indexOf(nameModule + ".js"), 1);
            }

            if (configValue.commandDisabled.includes(nameModule + ".js")) {
                configValue.commandDisabled.splice(configValue.commandDisabled.indexOf(nameModule + ".js"), 1);
            }

            global.client.commands.set(command.config.name, command);
            console.log(`[ CMD ] Loaded command ${command.config.name}!`);
        } catch (error) {
            errorList.push(`- ${nameModule} reason: ${error}`);
        }
    }

    if (errorList.length > 0) {
        api.sendMessage(`[CMD] » Some modules failed to load:\n${errorList.join("\n")}`, threadID, messageID);
    }

    api.sendMessage(`[CMD] » Successfully loaded ${moduleList.length - errorList.length} command(s) ♻️\n━━━━━━━━━━━━━━━\n[𝗟𝗼𝗮𝗱𝗲𝗱] » (${moduleList.join(", ")}) 💓`, threadID, messageID);
    writeFileSync(configPath, JSON.stringify(configValue, null, 4), "utf8");
    unlinkSync(configPath + ".temp");
};

const unloadModule = function ({ moduleList, threadID, messageID }) {
    const { configPath, mainPath, api } = global.client;
    

    delete require.cache[require.resolve(configPath)];
    let configValue = require(configPath);
    writeFileSync(configPath + ".temp", JSON.stringify(configValue, null, 4), "utf8");

    for (const nameModule of moduleList) {
        global.client.commands.delete(nameModule);
        global.client.eventRegistered = global.client.eventRegistered.filter(item => item !== nameModule);
        configValue.commandDisabled.push(`${nameModule}.js`);
        global.config.commandDisabled.push(`${nameModule}.js`);
        console.log(`[ CMD ] Unloaded command ${nameModule}!`);
    }

    writeFileSync(configPath, JSON.stringify(configValue, null, 4), "utf8");
    unlinkSync(configPath + ".temp");
    return api.sendMessage(`[CMD] » Successfully unloaded ${moduleList.length} command(s) ✨`, threadID, messageID);
};

module.exports.run = function ({ event, args, api }) {
    const { threadID, messageID } = event;
    let moduleList = args.slice(1);

    switch (args[0]) {
        case "load":
            if (moduleList.length === 0) return api.sendMessage("[CMD] » Module name cannot be blank ⚠️", threadID, messageID);
            return loadCommand({ moduleList, threadID, messageID });

        case "unload":
            if (moduleList.length === 0) return api.sendMessage("[CMD] » Module name cannot be blank ⚠️", threadID, messageID);
            return unloadModule({ moduleList, threadID, messageID });

        case "loadAll":
            moduleList = readdirSync(__dirname)
                .filter(file => file.endsWith(".js") && !file.includes("example"))
                .map(file => file.replace(/\.js$/, ""));
            return loadCommand({ moduleList, threadID, messageID });

        case "unloadAll":
            moduleList = readdirSync(__dirname)
                .filter(file => file.endsWith(".js") && !file.includes("example") && !file.includes("command"))
                .map(file => file.replace(/\.js$/, ""));
            return unloadModule({ moduleList, threadID, messageID });

        default:
            return api.sendMessage("Invalid syntax! Usage: cmd [load/unload/loadAll/unloadAll] [module_name]", threadID, messageID);
    }
};
