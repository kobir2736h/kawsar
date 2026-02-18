module.exports.config = {
    name: "console",
    version: "1.0.0",
    hasPermssion: 3,
    credits: "Kawsar Ahmed",
    description: "Make the console more beautiful",
    commandCategory: "Admin-bot system",
    usages: "console",
    cooldowns: 0
};

module.exports.handleEvent = async function ({ api, event }) {
    // ইভেন্ট থেকে সরাসরি ডাটা বের করা হচ্ছে
    const { threadID, senderID, body } = event;

    // বটের নিজের মেসেজ হলে লগ করবে না
    if (senderID == api.getCurrentUserID()) return;

    // চেক করা হচ্ছে এই গ্রুপের জন্য কনসোল অফ করা আছে কিনা
    const threadData = global.data.threadData.get(threadID) || {};
    if (typeof threadData["console"] !== "undefined" && threadData["console"] == true) return;

    // গ্রুপ এবং ইউজার নেম ক্যাশ (global.data) থেকে নেওয়া হচ্ছে
    let groupName = "Unknown Group";
    if (global.data.threadInfo.has(threadID)) {
        groupName = global.data.threadInfo.get(threadID).threadName || "Name does not exist";
    }

    let userName = "Unknown User";
    if (global.data.userName.has(senderID)) {
        userName = global.data.userName.get(senderID);
    } else {
        userName = senderID;
    }

    const msg = body || "Photos, videos or special characters";

    // সাধারণ কনসোল লগ প্রিন্ট
    console.log(`\n================================`);
    console.log(`[💓] Group   : ${groupName}`);
    console.log(`[🔎] ID      : ${threadID}`);
    console.log(`[🙂] User    : ${userName}`);
    console.log(`[📝] User ID : ${senderID}`);
    console.log(`[📩] Content : ${msg}`);
    console.log(`================================\n`);
};

module.exports.run = async function ({ api, event, Threads }) {
    const { threadID, messageID } = event;
    let data = (await Threads.getData(threadID)).data;

    // টগল সিস্টেম (Console অন/অফ)
    if (typeof data["console"] == "undefined" || data["console"] == true) {
        data["console"] = false; // False মানে অন
    } else {
        data["console"] = true; // True মানে অফ
    }

    await Threads.setData(threadID, { data });
    global.data.threadData.set(threadID, data);

    const status = data["console"] == false ? "Turned ON" : "Turned OFF";
    return api.sendMessage(`Console logs have been ${status} for this group.`, threadID, messageID);
};
