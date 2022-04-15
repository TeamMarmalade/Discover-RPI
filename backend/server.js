// server init + mods
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
const axios = require('axios').default;
const fs = require('fs');

//MongoImplementation
var dorms;
const { MongoClient, ServerApiVersion } = require('mongodb');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  if (err) { throw err; }
  //dorms = client.db("DiscoverRPI").collection("dorms").findAll({});
  // perform actions on the collection object
  client.close();
});

/*fs.readFile('./dorms.json', 'utf8', (err, data) => {
  if (err) {
      console.log(`Error reading file from disk: ${err}`);
  } else {
    // parse JSON string to JSON object
    dorms = JSON.parse(data);
  }
});*/

// Load static
app.use(express.static(__dirname + '/dist/frontend'));

// sign-up and login
// will eventually be google oath
app.post('/login', (req, res) => {
  // request expected: {"username": "user", "password": "password1"}
  if (!(req.body.hasOwnProperty('username') && req.body.hasOwnProperty('password') && Object.keys(req.body).length == 2)) {
    // request format is incorrect
    // bad request: 400
    res.status(400).send();
  } else {
    fs.readFile(__dirname + "/users.json", 'utf-8', function (err, data) {
      if (err) { console.log(`Error reading file from disk: ${err}`); res.status(500).send(); }
      users = JSON.parse(data);
      users.push(req.body);
      users = JSON.stringify(users);
      console.log(users);

      fs.writeFile(__dirname + "/users.json", users, 'utf-8', function (err) {
        if (err) { console.log(`Error writing file to disk: ${err}`); res.status(500).send(); }
        console.log('users updated successfully');
      });
    });
    // success
    res.status(200).send();
  }
});

app.get('/login', (req, res) => {
  //query strings exprected: ?uname=<name>&pass=<password>
  if (req.query.hasOwnProperty("uname") && req.query.hasOwnProperty("pass") && Object.keys(req.query).length == 2) {
    // looking for specific user
    fs.readFile(__dirname + "/users.json", 'utf-8', function (err, data) {
      if (err) { console.log(`Error reading file from disk: ${err}`); res.status(500).send(); }
      let users = JSON.parse(data);
      for (let i = 0; i < users.length; ++i) {
        let user = users[i];
        // console.log(user);
        // console.log(req.query.uname)
        if (user.username == req.query.uname && user.password == req.query.pass) {
          // user found successfully
          res.status(200).json({ "logged": true, "username": user.username });
          return;
        }
      }
      // incorrect credentials
      // password incorrect or user not found
      res.status(200).json({ "logged": false, "username": "" });
    });
  } else {
    // bad request
    res.status(400).send();
  }
});

// server dorm route handler
app.get('/dorms', (req, res) => {
  // var arr = [];
  // for(var key in dorms["dorms"]) {
  //   var dorm = dorms["dorms"][key];
  //   arr.push(dorm["name"]);
  // }

  res.status(200).json({ "dorms": dorms })
});

// server dorm item route handler
app.get('/dorms/:dorm', (req, res) => {
  // can be called by either the common or official dorm name
  client.connect(err => {
    if (err) throw err;
    dorms = client.db("DiscoverRPI").collection("dorms").find();
    console.log(dorms);
    for (let i = 0; i < dorms.length; i++) {
      console.log(dorms[i]);
      var dorm = dorms[i];
      if (dorm.name.common === req.params.dorm || dorm.name.official === req.params.dorm) {
        res.status(200).json(dorm);
      }
    }
  });
  /*for(var key in dorms["dorms"]) {
    console.log(dorms["dorms"][key]);
    var dorm = dorms["dorms"][key];
    if (dorm.name.common === req.params.dorm || dorm.name.official === req.params.dorm) {
      res.status(200).json(dorm);
    }
  }*/
  res.status(404).send();
});

app.get('/dorms/:dorm/reviews', (req, res) => {
  client.connect(err => {
    if (err) { throw err }
    let reviews = client.db("DiscoverRPI").collection("reviews");
    var displayReviews = {
      "bar-h": 0,
      "blitman": 0,
      "barton": 0,
      "bray": 0,
      "cary": 0,
      "crockett": 0,
      "davison": 0,
      "nason": 0,
      "nugent": 0,
      "sharp": 0,
      "warren": 0,
      "colonie": 0,
      "rhaps": 0,
      "e-complex": 0,
      "north": 0,
      "quad": 0,
      "stackwyck": 0,
      "bryckwyck": 0,
      "city station south": 0,
      "polytechnic": 0
    };
    if (!displayReviews.hasOwnProperty(req.params.dorm)) {
      res.status(404).send("dorm not found");
      return;
    }
    displayDorms[req.params.dorm] = 1;
    res.status(200).send(reviews.findOne({}, displayReviews));
    client.close();
  });
});

app.put('/dorms/reviews/:id', (req, res) => {
  res.status(200).json({
    "added": true
  })
});

app.post('/dorms/:dorm/reviews', (req, res) => {
  // if (!(req.query.hasOwnProperty("comment") && req.query.hasOwnProperty("uname") && Object.keys(req.query).length == 2)) {
  //   // query string /dorms/:dorm/reviews?comment=ThisDormIsGood
  //   // if that isn't there^
  //   res.status(400).send();
  //   return;
  // } else {
  //   for (var key in dorms["dorms"]) {
  //     var dorm = dorms["dorms"][key];
  //     if (dorm.name.common === req.params.dorm || dorm.name.official === req.params.dorm) {
  //       fs.readFile(__dirname + "/dorms.json", 'utf-8', function(err, data){
  //         if (err) {console.log(`Error reading file from disk: ${err}`); res.status(500).send();}
  //         let dorms = JSON.parse(data);
  //         // overwrites last comment for now
  //         dorms["dorms"][key]["reviews"][req.query.uname] = req.query.comment;
  //         dorms = JSON.stringify(dorms);
  //         fs.writeFile(__dirname + "/dorms.json", dorms, 'utf-8', function (err) {
  //           if (err) {console.log(`Error writing file to disk: ${err}`); res.status(500).send();}
  //           console.log('dorm review updated successfully');
  //           res.status(200).send();
  //           return;
  //         });
  //       });
  //     } else if (key == dorms["dorms"].length - 1) {
  //       // res.status(404).send();
  //       // return;
  //     }
  //   }
  // }

});

app.delete('/dorms/reviews/:id', (req, res) => {
  res.status(200).json({
    "removed": true
  });
});

// server main route handler
app.get('/*', function (req, res) {
  res.sendFile(__dirname + '/dist/frontend/index.html');
});

// app.get('/dorms/:dormname', function(req, res) {

// });

// app.get('/dorms/:dormname/reviews', function(req, res) {

// });

// start server
http.listen(3000, function () {
  console.log('Server up on *:3000');
});
