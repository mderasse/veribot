/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
module.exports = function (controller) {

    // use a function to match a condition in the message
    controller.hears(['help'], 'direct_message, direct_mention', function (bot, message) {
        bot.reply(message, 'Booo\\! *This* **message** is ephemeral and \nprivate to you')
    })

    // use a function to match a condition in the message
    controller.hears(['i love you'], 'direct_message, direct_mention, mention', function (bot, message) {
        bot.reply(message, 'You are embarrassing me, i\'m a robot you know ?');
    })
}