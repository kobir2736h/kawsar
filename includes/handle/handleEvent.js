const fs = require("fs");
const path = require("path");
const freezePath = path.join(__dirname, "..", "..", "freeze.lock");

module.exports = function ({ api, models, Users, Threads, Currencies }) {
    // logger require বাদ দেওয়া হলো
    const moment = require("moment-timezone");

    return function ({ event }) {
        if (fs.existsSync(freezePath)) {
            // Freeze mode: কোনো ইভেন্ট হ্যান্ডল করা হবে না
            return;
        }

        const timeStart = Date.now();
        const time = moment.tz("Asia/Kolkata").format("HH:mm:ss L");
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;
        var { senderID, threadID } = event;
        senderID = String(senderID);
        threadID = String(threadID);
        if ((allowInbox == false && senderID == threadID)) return;
        if (event.type == "change_thread_image") event.logMessageType = "change_thread_image";

        for (const [key, value] of events.entries()) {
            if (value.config.eventType.indexOf(event.logMessageType) !== -1) {
                const eventRun = events.get(key);
                try {
                    const Obj = {};
                    Obj.api = api;
                    Obj.event = event;
                    Obj.models = models;
                    Obj.Users = Users;
                    Obj.Threads = Threads;
                    Obj.Currencies = Currencies;
                    eventRun.run(Obj);
                    
                    if (DeveloperMode === true) {
                        // handleEvent.executeEvent=[ %1 ] Event was executed: %2 at thread: %3 | Processing time: %4ms
                        console.log(`[ ${time} ] Event was executed: ${eventRun.config.name} at thread: ${threadID} | Processing time: ${Date.now() - timeStart}ms`);
                    }
                } catch (error) {
                    // handleEvent.eventError=Having some error when executing event %1, error: %2
                    console.error(`Having some error when executing event ${eventRun.config.name}, error: ${JSON.stringify(error)}`);
                }
            }
        }
        return;
    };
};
