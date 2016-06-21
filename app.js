var restify = require('restify');
var builder = require('botbuilder');

// dialogs
var searchStories = require('./dialogs/searchStories.js');
var greetings = require('./dialogs/greetings.js');

// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ appId: process.env.APP_ID || 'AppId', appSecret: process.env.APP_SECRET || 'AppSecret' });

bot.add('/', searchStories);
bot.add('/greetings', greetings);

// Install First Run middleware and dialog
bot.use(function (session, next) {
   if (!session.userData.firstRun) {
       session.userData.firstRun = true;
       session.beginDialog('/greetings');
   } else {
       session.beginDialog('/');
   }
});

// Setup Restify Server
var server = restify.createServer();
server.post('/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url); 
});
