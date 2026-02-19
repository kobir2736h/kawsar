module.exports = function ({ api, models }) {
  const fs = require("fs");
  const Users = require("./controllers/users")({ models, api });
  const Threads = require("./controllers/threads")({ models, api });
  const Currencies = require("./controllers/currencies")({ models });
  
  const isBlocked = require("./wlt"); // ✅ whitelist checker import

  ///////////////////////////////////////
  //========= Load environment =========//
  ///////////////////////////////////////

  (async function () {
    try {
      // listen.startLoadEnvironment = Proceed to load the environment variable ...
      console.log('[ Priyansh Rajput ] Proceed to load the environment variable ...');

      let threads = await Threads.getAll(),
          users = await Users.getAll(['userID', 'name', 'data']),
          currencies = await Currencies.getAll(['userID']);

      for (const data of threads) {
        const idThread = String(data.threadID);
        global.data.allThreadID.push(idThread);
        global.data.threadData.set(idThread, data['data'] || {});
        global.data.threadInfo.set(idThread, data.threadInfo || {});

        if (data?.data?.commandBanned?.length)
          global.data.commandBanned.set(idThread, data.data.commandBanned);

        if (data?.data?.NSFW)
          global.data.threadAllowNSFW.push(idThread);
      }

      // listen.loadedEnvironmentThread = Loaded thread environment variable successfully
      console.log('Loaded thread environment variable successfully');

      for (const dataU of users) {
        const idUsers = String(dataU.userID);
        global.data.allUserID.push(idUsers);

        if (dataU.name?.length)
          global.data.userName.set(idUsers, dataU.name);

        if (dataU?.data?.commandBanned?.length)
          global.data.commandBanned.set(idUsers, dataU.data.commandBanned);
      }

      for (const dataC of currencies)
        global.data.allCurrenciesID.push(String(dataC.userID));

      // listen.loadedEnvironmentUser = Loaded user environment variable successfully
      console.log('Loaded user environment variable successfully');
      
      // listen.successLoadEnvironment = Loaded environment variable successfully
      console.log('[ Priyansh ] Loaded environment variable successfully');

    } catch (error) {
      // listen.failLoadEnvironment = Can't load environment variable, error: %1
      return console.error(`Can't load environment variable, error: ${error}`);
    }
  })();

  console.log(`[ Priyansh Rajput ] [ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "" : global.config.BOTNAME}`);

  ///////////////////////////////////////////////
  //========= Require all handle need =========//
  ///////////////////////////////////////////////

  const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
  const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
  const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
  const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
  const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
  const handleCreateDatabase = require("./handle/handleCreateDatabase")({ api, Threads, Users, Currencies, models });

  //////////////////////////////////////////////////
  //========= Send event to handle need =========//
  /////////////////////////////////////////////////

  return (event) => {
    if (isBlocked(event)) return; // ✅ whitelist block check

    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        handleCreateDatabase({ event });
        handleCommand({ event });
        handleReply({ event });
        handleCommandEvent({ event });
        break;
      case "event":
        handleEvent({ event });
        break;
      case "message_reaction":
        handleReaction({ event });
        break;
      default:
        break;
    }
  };
};
