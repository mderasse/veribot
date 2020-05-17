module.exports = function (controller) {

    require('../config/command').forEach(element => {
        controller.hears(element.keyword, element.events, function (bot, message) {
            bot.reply(message, element.message);
        })
    });
}