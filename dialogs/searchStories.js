var builder = require('botbuilder');
var request = require('request');

var storiesToShow = 3;

var searchStories = function (session) {
  session.send("Just a sec, I’m looking that up...");

  // start searching
  var queryUrl = 'http://hn.algolia.com/api/v1/search_by_date?tags=story&query=' + session.message.text;
  request(queryUrl, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var result = JSON.parse(body);

      if(result.hits.length === 0){
        // no stores
        session.send("Nothing yet. Let’s try another search.");
      } else {
        // have stores
        session.send("Here are the latest stories related to " + session.message.text);

        // show stores
        for (i = 0; i < storiesToShow; i++) { 
          if(result.hits[i] === undefined) break;

          // only show stores with url
          if(result.hits[i].url) {
            var msg = "[" + result.hits[i].title + "](" + result.hits[i].url + ")";
            session.send(msg);
          } else {
            // make it loop one more time
            storiesToShow++;
          }
        }

        // reset
        storiesToShow = 3;
      }
    } else {
      session.send("Sorry there was an error.");
    }
  })
}

module.exports = searchStories;
