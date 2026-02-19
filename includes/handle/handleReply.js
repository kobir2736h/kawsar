module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        if (!event.messageReply) return;
        const { handleReply, commands } = global.client;
        const { messageID, threadID, messageReply } = event;

        if (handleReply.length !== 0) {
            const indexOfHandle = handleReply.findIndex(e => e.messageID == messageReply.messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReply[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);

            // handleReply.missingValue = Missing value to respond your problem
            if (!handleNeedExec) return api.sendMessage("Missing value to respond your problem", threadID, messageID);

            try {
                // getText এর জটিল লজিক বাদ দিয়ে সিম্পল ফাংশন
                const getText2 = () => {};

                const Obj = {
                    api,
                    event,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    handleReply: indexOfMessage,
                    getText: getText2
                };

                handleNeedExec.handleReply(Obj);
                return;
            } catch (error) {
                // handleReply.executeError = Having some error when responding your problem, error: %1
                return api.sendMessage(`Having some error when responding your problem, error: ${error}`, threadID, messageID);
            }
        }
    };
};
