//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the veribot bot.

// Import Botkit's core features
const Winston = require('winston');
const Botkit = require('botkit');
const BotkitDiscord = require('botkit-discord');
const BotkitTelegram = require('botkit-telegram');


// Load process.env values from .env file
require('dotenv').config();

// Init logs
const log = new (Winston.Logger)({
    level: process.env.LOG_LEVEL || 'info',
    levels: Winston.config.syslog.levels,
    transports: [
        new Winston.transports.Console({
            colorize: true,
            prettyPrint: true,
            timestamp: true
        }),
    ]
});
var debug = log.level == 'debug' || log.level == 'silly';

function initSlack(log) {
    if (!process.env.SLACK_BOT_TOKEN) {
        log.warning('Missing SLACK_BOT_TOKEN, skipping Slack ')
        return;
    }

    log.info('Initializing Slack Bot')
    var controller = Botkit.slackbot({
        clientSigningSecret: process.env.SLACK_SIGNING_SECRET,
        debug: debug,
        logger: log,
        retry: 10,
    });

    log.info('Initializing Slack Bot')
    var bot = controller.spawn({
        token: process.env.SLACK_BOT_TOKEN,
    }).startRTM();

    var normalizedPath = require("path").join(__dirname, "feature");
    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        require("./feature/" + file)(controller);
    });
}


function initDiscord(log) {
    if (!process.env.DISCORD_BOT_TOKEN) {
        log.warning('Missing DISCORD_BOT_TOKEN, skipping Discord ')
        return;
    }

    log.info('Initializing Discord Bot')

    const controller = BotkitDiscord({
        token: process.env.DISCORD_BOT_TOKEN,
        debug: debug,
        logger: log,
        retry: 10,
    });

    var normalizedPath = require("path").join(__dirname, "feature");
    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        require("./feature/" + file)(controller);
    });
}

function initTelegram(log) {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
        log.warning('Missing TELEGRAM_BOT_TOKEN, skipping Telegram ')
        return;
    }

    log.info('Initializing Telegram Bot')
    var controller = BotkitTelegram({
        token: process.env.TELEGRAM_BOT_TOKEN,
        debug: debug,
        logger: log,
        retry: 10,
    })

    var normalizedPath = require("path").join(__dirname, "feature");
    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        require("./feature/" + file)(controller);
    });
}


initSlack(log);
initDiscord(log);
initTelegram(log);