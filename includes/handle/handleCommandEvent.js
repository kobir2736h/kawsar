const fs = require("fs");
const path = require("path");
const freezePath = path.join(__dirname, "..", "..", "freeze.lock");

module.exports = function ({ api, models, Users, Threads, Currencies }) {
    // logger require বাদ দেওয়া হলো
    return function ({ event }) {
        if (fs.existsSync(freezePath)) {
            // Freeze mode: কোনো ইভেন্ট হ্যান্ডল করা হবে না
            return;
        }

        const { allowInbox } = global.config;
        const { commands, eventRegistered } = global.client;
        var { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);
        if ((allowInbox == false && senderID == threadID)) return;
        
        for (const eventReg of eventRegistered) {
            const cmd = commands.get(eventReg);
            
            // getText এর লজিক বাদ দিয়ে সিম্পল ফাংশন
            var getText2 = () => {};

            try {
                const Obj = {
                    event,
                    api,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    getText: getText2
                };
                
                if (cmd) cmd.handleEvent(Obj);
            } catch (error) {
                // handleCommandEvent.moduleError টেক্সট টি এখানে বসানো হলো
                // %1 = cmd.config.name, %2 = error
                console.error(`Having some unexpected error when using command ${cmd.config.name}, error: ${error}`);
            }
        }
    };
};
