module.exports.config = {
  name: "mentionreply",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Kawsar Ahmed",
  description: "Bot will reply when someone tags admin",
  commandCategory: "Other",
  usages: "",
  cooldowns: 1
};

module.exports.handleEvent = function({ api, event }) {
  // Safety Check: mentions না থাকলে বা senderID বট হলে রিটার্ন
  if (!event.mentions || event.senderID == api.getCurrentUserID()) return;

  const listAdmin = global.config.ADMINBOT || []; // Config থেকে অ্যাডমিন লিস্ট নেওয়া হচ্ছে
  const mentionIDs = Object.keys(event.mentions); // যারা মেনশন হয়েছে তাদের আইডি

  // চেক করা হচ্ছে মেনশন করা আইডির মধ্যে কোনো অ্যাডমিন আছে কিনা
  for (const id of mentionIDs) {
    if (listAdmin.includes(id)) {
      var msg = [
        "ওই ব্যস্ত আছে, বলো কি বলবো?",
        "কি হয়েছে? বস্‌কে কেন ডেকে নিয়ে আসছো?",
        "সে হয়তো ব্যস্ত আছে",
        "কাউসার তো চলে গেছে"
      ];
      
      return api.sendMessage({
        body: msg[Math.floor(Math.random() * msg.length)]
      }, event.threadID, event.messageID);
    }
  }
};

module.exports.run = async function({}) {};
