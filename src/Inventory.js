const config = require('../config.json');
const { errEmbed } = require('./Discord');
const { logToFile } = require('../index');
const { descEmbed } = require('./Embed');

if (config.debug) log('<src/Inventory.js> Started');
async function listInventory()
{
    try
    {
        logToFile('<src/Inventory.js> listInventory executed', dir);
        if (config.debug) log('<src/Inventory.js> listInventory executed');
        const { bot } = require('./Bot');
        let botInv = bot.inventory.items().map(item => `${item.name} x ${item.count}`).join('\n');
        if (botInv.length > 2000) botInv = botInv.slice(1, 2000);
        if (!botInv) botInv = 'Inventory empty';
    
        await descEmbed('Bot inventory', botInv);
        logToFile('<src/Inventory.js> Sent inventoryEmbed', dir);
    }
    catch (err)
    {
        logToFile(`<src/Inventory.js> Error ${err}`, dir);
        errEmbed(err, '- Start the bot before using this command\n- If the bot had started when this error ocurred, please report it as a bug');
    };
};

async function rawInventory()
{
    try
    {
        logToFile('<src/Inventory.js> rawInventory executed', dir);
        if (config.debug) log('<src/Inventory.js> listInventory executed');
        const { bot } = require('./Bot');
        const { logInv } = require('./Logging');
        let rawInv = JSON.stringify(bot.inventory.items(), null, 2);
        if (rawInv.length > 2000)
        {
            logInventory();
            rawInv = rawInv.slice(1, 1900);
        };

        await descEmbed('Raw Bot inventory', '```js\n'+rawInv+'\n```\nIf inventory is cut off, it\'s because of the Discord Character Limit, you can view the full message inside /files/InventoryJSON.json');
        logToFile('<src/Inventory.js> Sent inventoryEmbed', dir);

        async function logInventory()
        {
            await logInv(rawInv);
        };
    }
    catch (err)
    {
        logToFile(`<src/Inventory.js> Error ${err}`, dir);
        errEmbed(err, '- Start the bot before using this command\n- If the bot had started when this error ocurred, please report it as a bug');
    };
};

function emptyInventory()
{
    try
    {
        logToFile('<src/Inventory.js> emptyInventory executed', dir);
        if (config.debug) log('<src/Inventory.js> emptyInventory executed');
        const { bot } = require('./Bot');

        tossEach();
        function tossEach()
        {
            if (bot.inventory.items().length === 0) return;
            bot.tossStack(bot.inventory.items()[0], (err) =>
            {
                if (err) 
                {
                    setTimeout(() => {
                        tossEach();
                    }, 1000);
                    return;
                };

                setTimeout(() => {
                    tossEach();
                }, 100);
            });
        };
    }
    catch (err)
    {
        logToFile(`<src/Inventory.js> Error ${err}`, dir);
        errEmbed(err, '- Start the bot before using this command\n- If the bot had started when this error ocurred, please report it as a bug');
    };
};

module.exports = {
    listInventory,
    rawInventory,
    emptyInventory
};
