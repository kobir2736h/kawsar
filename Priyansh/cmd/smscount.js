module.exports.config = {
    name: "smscount",
    version: "2.0.0",
    hasPermssion: 2,
    credits: "Kawsar + GPT",
    description: "শেষ ৩ দিনের sms count (কম থেকে বেশি)",
    commandCategory: "Admin",
    cooldowns: 10,
};

module.exports.run = async function ({ api, event, Users }) {
    const threadID = event.threadID;

    const DAY = 3; // শেষ কয়দিন
    const LIMIT_TIME = Date.now() - DAY * 24 * 60 * 60 * 1000;

    let lastMessageID = null;
    let msgData = {};

    api.sendMessage("📤 শেষ ৩ দিনের মেসেজ স্ক্যান হচ্ছে...", threadID);

    while (true) {
        const messages = await api.getThreadHistory(threadID, 100, lastMessageID);
        if (!messages || messages.length === 0) break;

        for (let msg of messages) {
            if (!msg.senderID || !msg.timestamp) continue;

            // ৩ দিনের আগের হলে থামবে
            if (msg.timestamp < LIMIT_TIME) {
                lastMessageID = null;
                break;
            }

            msgData[msg.senderID] = (msgData[msg.senderID] || 0) + 1;
        }

        if (!lastMessageID) break;
        lastMessageID = messages[messages.length - 1].messageID;
    }

    // কম sms → বেশি sms (ascending)
    const sorted = Object.entries(msgData)
        .sort((a, b) => a[1] - b[1]);

    if (sorted.length === 0) {
        return api.sendMessage("❌ শেষ ৩ দিনের কোনো মেসেজ পাওয়া যায়নি।", threadID);
    }

    let text = `📊 শেষ ৩ দিনের SMS Count (কম → বেশি)\n\n`;
    let i = 1;

    for (const [uid, count] of sorted) {
        const name = await Users.getNameUser(uid);
        text += `${i++}. ${name} — ${count} টি\n`;
    }

    api.sendMessage(text, threadID);
};
