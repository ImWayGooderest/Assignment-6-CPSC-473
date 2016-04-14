/* jshint node: true, curly: true, eqeqeq: true, forin: true, immed: true, indent: 4, latedef: true, newcap: true, nonew: true, quotmark: double, undef: true, unused: true, strict: true, trailing: true */
var express = require("express"),
  app = express(),
  redis = require("redis"),
  bodyParser = require("body-parser"),
  client = redis.createClient(),
  winCount,
  loseCount;

app.use(express.static(__dirname));
app.use(bodyParser());

app.listen(3000, function() {
  "use strict";
  console.log("Assignment 6 app listening on port 3000!");
});
// set up our routes
app.post("/flip", function(req, res) {
  "use strict";
  client.mget(["winCount", "loseCount"], function(err, results) {
    if (err !== null) {
      console.log("ERROR: " + err);
      return;
    }
    winCount = parseInt(results[0], 10) || 0;
    loseCount = parseInt(results[1], 10) || 0;
  });
  console.log("Flipping the coin");
  var coin;
  var randomnumber = Math.floor(Math.random() * 2);
  if (randomnumber === 0) {
    coin = "tails";
  } else {
    coin = "heads";
  }

  if (coin === req.body.call) {
    console.log("You Won");
    client.incr("winCount");
    res.send(JSON.stringify({"result": "win"}));
  } else {
    console.log("You Lost");
    client.incr("loseCount");
    res.send(JSON.stringify({"result": "lose"}));

  }
});
app.get("/stats", function(req, res) {
  "use strict";
  client.mget(["winCount", "loseCount"], function(err, results) {
    if (err !== null) {
      console.log("ERROR: " + err);
      return;
    }
    winCount = parseInt(results[0], 10) || 0;
    loseCount = parseInt(results[1], 10) || 0;
    res.send(JSON.stringify({
      "wins": winCount,
      "losses": loseCount
    }));
  });

});
app.delete("/stats", function(req, res) {
  "use strict";
  client.mset("winCount", 0, "loseCount", 0, function(err, results) {
    console.log("Win Count and Lose Count have been reset!");
    client.mget(["winCount", "loseCount"], function(err, results) {
      if (err !== null) {
        console.log("ERROR: " + err);
        return;
      }
      winCount = parseInt(results[0], 10) || 0;
      loseCount = parseInt(results[1], 10) || 0;
      res.send(JSON.stringify({
        "wins": winCount,
        "losses": loseCount
      }));
    });
  });
});