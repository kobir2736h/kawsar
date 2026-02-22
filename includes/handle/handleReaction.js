module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        const { handleReaction, commands } = global.client;
        const { messageID, threadID, reaction } = event; 

        // 😠 ইমোজি থাকলে মেসেজ আনসেন্ড করার লজিক
        if (reaction === '😠') {
            return api.unsendMessage(messageID);
        }

        if (handleReaction.length !== 0) {
            const indexOfHandle = handleReaction.findIndex(e => e.messageID == messageID);
            if (indexOfHandle < 0) return;
            const indexOfMessage = handleReaction[indexOfHandle];
            const handleNeedExec = commands.get(indexOfMessage.name);

            // handleReaction.missingValue = Missing value to respond your problem
            if (!handleNeedExec) return api.sendMessage("Missing value to respond your problem", threadID, messageID);
            
            try {
                // getText এর জটিল লজিক বাদ দিয়ে সিম্পল ফাংশন
                var getText2 = () => {};

                const Obj = {
                    api,
                    event,
                    models,
                    Users,
                    Threads,
                    Currencies,
                    handleReaction: indexOfMessage,
                    getText: getText2
                };
                
                handleNeedExec.handleReaction(Obj);
                return;
            } catch (error) {
                // handleReaction.executeError = Having some error when responding to your problem, error: %1
                return api.sendMessage(`Having some error when responding to your problem, error: ${error}`, threadID, messageID);
            }
        }
    };
};
