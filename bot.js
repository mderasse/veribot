//  __   __  ___        ___
// |__) /  \  |  |__/ |  |  
// |__) \__/  |  |  \ |  |  

// This is the main file for the veribot bot.

// Import Botkit's core features
const Winston = require('winston');
const Botkit = require('botkit');
const BotkitDiscord = require('botkit-discord');
const BotkitTelegram = require('botkit-telegram');

var appConfig = require('./config/app');

// Init logs
const log = new (Winston.Logger)({
    level: appConfig.logs.level || 'info',
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
    if (!appConfig.platform.slack.token) {
        log.warning('Missing SLACK_BOT_TOKEN, skipping Slack ')
        return;
    }

    log.info('Initializing Slack Bot')
    var controller = Botkit.slackbot({
        clientSigningSecret: appConfig.platform.slack.signingKey,
        debug: debug,
        logger: log,
        retry: 10,
    });

    log.info('Initializing Slack Bot')
    var bot = controller.spawn({
        token: appConfig.platform.slack.token,
    }).startRTM();

    var normalizedPath = require("path").join(__dirname, "feature");
    require("fs").readdirSync(normalizedPath).forEach(function (file) {
        require("./feature/" + file)(controller);
    });
}


function initDiscord(log) {
    if (!appConfig.platform.discord.token) {
        log.warning('Missing DISCORD_BOT_TOKEN, skipping Discord ')
        return;
    }

    log.info('Initializing Discord Bot')

    const controller = BotkitDiscord({
        token: appConfig.platform.discord.token,
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
    if (!appConfig.platform.telegram.token) {
        log.warning('Missing TELEGRAM_BOT_TOKEN, skipping Telegram ')
        return;
    }

    log.info('Initializing Telegram Bot')
    var controller = BotkitTelegram({
        token: appConfig.platform.telegram.token,
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