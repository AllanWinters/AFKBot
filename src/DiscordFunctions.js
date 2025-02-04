const config = require('../config.json');
const { Vec3 } = require('vec3');
const { pingServer } = require('./Ping');
const { startBot } = require('./Bot');
const { followPlayer, gotoCoord, stopPathfind } = require('./Pathfind');
const { Discord, client, errEmbed, channel } = require('./Discord');
const { logToFile } = require('../index');
const { clearLogFolder } = require('./Logging');
const { autoFish, stopFishing } = require('./Fishing');
const { listInventory, rawInventory, emptyInventory } = require('./Inventory');
const { returnViewer } = require('./Viewer');
const { fieldEmbed } = require('./Embed');

console.log(`<DISCORD> Logged in: ${client.user.tag}`);
if (config.discord['bot-rpc'].enable) client.user.setActivity(config.discord['bot-rpc'].text);
if (config.debug) log(`<src/DiscordFunctions.js> logged in`);
logToFile('<src/DiscordFunctions.js> Started', dir);

let commandList = [
    `${config.discord.prefix}help`,
    `${config.discord.prefix}ping`,
    `${config.discord.prefix}start`,
    `${config.discord.prefix}follow`,
    `${config.discord.prefix}stop`,
    `${config.discord.prefix}fish`,
    `${config.discord.prefix}stopfish`,
    `${config.discord.prefix}goto`,
    `${config.discord.prefix}list`,
    `${config.discord.prefix}empty`,
    `${config.discord.prefix}say`,
    `${config.discord.prefix}status`,
    `${config.discord.prefix}clearlogs`,
    `${config.discord.prefix}viewer`,
    `${config.discord.prefix}exit`,
    `${config.discord.prefix}rawinv`
];

const fieldArr = [
    { name: `${config.discord.prefix}help`, value: `Shows this command list` },
    { name: `${config.discord.prefix}ping`, value: `Ping the server specified in the config.json, returning the results`, inline: true },
    { name: `${config.discord.prefix}start`, value: `Start the bot`, inline: true },
    { name: `${config.discord.prefix}status`, value: `Status of the bot`, inline: true },
    { name: `${config.discord.prefix}follow [username]`, value: `Follows the player with the exact username`, inline: true },
    { name: `${config.discord.prefix}say [message]`, value: `Says [message] in chat. Disabled if "send-chat-to-minecraft" is set to true`, inline: true },
    { name: `${config.discord.prefix}fish`, value: `Start fishing and stop when inventory is full`, inline: true },
    { name: `${config.discord.prefix}stopfish`, value: `Stop fishing`, inline: true },
    { name: `${config.discord.prefix}goto [x] [y] [z]`, value: `Go to [x] [y] [z] coordinates`, inline: true },
    { name: `${config.discord.prefix}list`, value: `List inventory`, inline: true },
    { name: `${config.discord.prefix}rawinv`, value: `List raw inventory in JSON`, inline: true },
    { name: `${config.discord.prefix}empty`, value: `Empty inventory`, inline: true },
    { name: `${config.discord.prefix}viewer`, value: `Returns the port and the URL in which the current world viewer is running`, inline: true },
    { name: `${config.discord.prefix}clearlogs`, value: `Clears the logs folder`, inline: true },
    { name: `${config.discord.prefix}stop`, value: `Stops any kind of pathfinding`, inline: true },
    { name: `${config.discord.prefix}exit`, value: `Stops the program`, inline: true }
];
    
fieldEmbed('Commands', fieldArr, '');
if (config.debug) log(`<src/DiscordFunctions.js> sent command list`);
logToFile('<src/DiscordFunctions.js> Sent startEmbed', dir);

client.on('message', async (message) =>
{
    if (message.author.bot || message.channel.id !== config.discord['channel-id']) return;
    switch (message.cleanContent)
    {
        case `${config.discord.prefix}help`:
            logToFile('<src/DiscordFunctions.js> Help executed', dir);
            fieldEmbed('Commands', fieldArr, '');
        break;
        case `${config.discord.prefix}ping`:
            logToFile('<src/DiscordFunctions.js> Ping executed', dir);
            pingServer();
        break;
        case `${config.discord.prefix}start`:
            logToFile('<src/DiscordFunctions.js> Start executed', dir);
            startBot()
            .catch(err =>
            {
                logToFile(`<src/DiscordFunctions.js> Error: ${err}`, dir);
                errEmbed(err, `- Check credentials, IP and PORT\n - If error persists, ask on Discord or report it as a bug`);
            });
        break;
        case `${config.discord.prefix}status`:
            logToFile('<src/DiscordFunctions.js> Status executed', dir);
            const { getStatus } = require('./Status');
            getStatus().then(statusEmbed => channel.send(statusEmbed));
            logToFile('<src/Status.js> Sent statusEmbed', dir);
        break;
        case `${config.discord.prefix}fish`:
            logToFile('<src/DiscordFunctions.js> Fish executed', dir);
            autoFish();
        break;
        case `${config.discord.prefix}stopfish`:
            logToFile('<src/DiscordFunctions.js> Stopfish executed', dir);
            stopFishing();
        break;
        case `${config.discord.prefix}list`:
            logToFile('<src/DiscordFunctions.js> List executed', dir);
            listInventory();
        break;
        case `${config.discord.prefix}rawinv`:
            logToFile('<src/DiscordFunctions.js> Rawinv executed', dir);
            rawInventory();
        break;
        case `${config.discord.prefix}empty`:
            logToFile('<src/DiscordFunctions.js> Empty executed', dir);
            emptyInventory();
        break;
        case `${config.discord.prefix}viewer`:
            logToFile('<src/DiscordFunctions.js> Viewer executed', dir);
            returnViewer();
        break;
        case `${config.discord.prefix}clearlogs`:
            logToFile('<src/DiscordFunctions.js> Clearlogs executed', dir);
            clearLogFolder();
        break;
        case `${config.discord.prefix}stop`:
            logToFile('<src/DiscordFunctions.js> Stop executed', dir);
            stopPathfind();
        break;
        case `${config.discord.prefix}exit`:
            process.exit(0);
    };

    if (message.cleanContent.startsWith(`${config.discord.prefix}follow `))
    {
        logToFile('<src/DiscordFunctions.js> Follow executed', dir);
        const usernameToFollow = message.cleanContent.replace(`${config.discord.prefix}follow `, '');
        followPlayer(usernameToFollow);
    }
    else if(message.cleanContent.startsWith(`${config.discord.prefix}goto `))
    {
        logToFile('Goto executed', dir);
        const coordsFromMessage = message.cleanContent.split(' ');
        if (!coordsFromMessage[3]) return errEmbed(`Not a valid position`, `- Make sure the command is written like this, ${config.discord.prefix}goto [x] [y] [z], without the brackets`);
        const vecCoords = new Vec3(coordsFromMessage[1], coordsFromMessage[2], coordsFromMessage[3]);
        gotoCoord(vecCoords);
    };
});

module.exports = {
    Discord,
    client,
    commandList
};
