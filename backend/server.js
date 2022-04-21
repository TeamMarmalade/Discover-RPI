// server init + mods
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
const axios = require('axios').default;
const fs = require('fs');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Mongo Implementation
// mongodb+srv://user1:User123@cluster0.neiqy.mongodb.net/test
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user_x:TeamMarmalade@cluster0.neiqy.mongodb.net/Cluster0?retryWrites=true&w=majority";
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

// server dorm route handler
app.get('/dorms', (req, res) => {
  // var arr = [];
  // for(var key in dorms["dorms"]) {
  //   var dorm = dorms["dorms"][key];
  //   arr.push(dorm["name"]);
  // }
  var dorms = [];
  client.connect(err => {
    if (err) throw err;
    client.db("DiscoverRPI").collection("dorms").find({}).forEach((doc) => {
      dorms.push(doc);
    }).then(() => {
      res.status(200).json({ "dorms": dorms });
    });
  });

  // res.status(500).json({ "message": "error" })
});

// server dorm item route handler
app.get('/dorms/:dorm', (req, res) => {
  var dorms = [];
  // can be called by either the common or official dorm name
  client.connect(err => {
    if (err) throw err;
    client.db("DiscoverRPI").collection("dorms").find().forEach((doc) => {
      dorms.push(doc);
    });
    for (let i = 0; i < dorms.length; i++) {
      console.log(dorms[i]);
      var dorm = dorms[i];
      if (dorm.name.common === req.params.dorm || dorm.name.official === req.params.dorm) {
        res.status(200).json(dorm);
        return;
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
  
  res.status(404).json({
    message: "Dorm not found"
  });
});

app.get('/dorms/:dorm/reviews', (req, res) => {
  var dorms = [];
  client.connect(err => {
    if (err) { throw err }
    client.db("DiscoverRPI").collection("reviews").findOne({_id : req.params.dorm }, function(err, re) {
      delete re._id;
      comments = [];
      for(let i in re) {
        comments.push({ name: i, review: re[i] });
      }
      res.status(200).json({ reviews: comments });
    });
  });
});

app.get('/dorms/:dorm/reviews/:user', (req, res) => {
  var dorms = [];
  client.connect(err => {
    if (err) { throw err }
    let db = client.db("DiscoverRPI").collection("reviews");
    let projection = {};
    projection[req.params.user] = 1;
    projection["_id"] = 0;
    db.findOne({_id : req.params.dorm }, {projection}, function(err, re) {
      delete re._id;
      res.json({ reviews: [re] });
    });
  });
});

app.put('/dorms/:dorm/reviews/:user', (req, res) => {
  var dorms = [];
  // request body:
  // {
  //   "content": "great dorm",
  //   "stars": 5,
  //   "upvotes": ["user1", "user2"]
  // }
  if (!(req.body != null && Object.keys(req.body).length == 3 && req.body.hasOwnProperty("content") && req.body.hasOwnProperty("stars") && req.body.hasOwnProperty("upvotes"))) {
    res.status(400).send("Request body in wrong json format");
    return;
  }
  client.connect(err => {
    if (err) { throw err }
    let db = client.db("DiscoverRPI").collection("reviews");
    db.findOne({_id : req.params.dorm }, function(err, re) {
      if (err) { res.status(500).send(); console.log(err); client.close(); return; } 
      let user = req.params.user;
      if (re.hasOwnProperty(user)) {
        // review exists
        db.updateOne({_id : req.params.dorm }, {$set: {user: req.body}}, function(err, r) {
          if (err) { res.status(500).send(); console.log(err); client.close(); return; }
          res.status(200).json(r);
        });
      } else {
        res.status(404).send("review on specified dorm and user not found");
        client.close();
        return;
      }
    });
  });
});

app.post('/dorms/:dorm/reviews', (req, res) => {
  var dorms = [];
  // request body:
  // {
  //   "user": "test-user",
  //   "content": "great dorm",
  //   "stars": 5,
  //   "upvotes": ["user1", "user2"]
  // }
  if (!(Object.keys(req.body).length == 4 && req.body.hasOwnProperty("content") && req.body.hasOwnProperty("stars") && req.body.hasOwnProperty("upvotes")&& req.body.hasOwnProperty("user"))) {
    res.status(400).send("Request body in wrong json format");
    return;
  }

  client.connect(err => {
    if (err) { throw err }
    let db = client.db("DiscoverRPI").collection("reviews");
    db.findOne({_id : req.params.dorm }, function(err, re) {
      if (err) { res.status(500).send(); console.log(err); client.close(); return; } 
      let user = req.body.user;
      if (re.hasOwnProperty(user)) {
        // review already exists
        res.status(400).json({ "message": "user " + user + " already has a review for this dorm" });
      } else {
        // review does not exist
        // create review format
        let update = {};
        update[user] = req.body;
        delete update[user]["user"];
        // post review
        db.updateOne({_id : req.params.dorm }, {$set: update}, function(err, r) {
          if (err) { res.status(500).send(); console.log(err); client.close(); return; }
          res.status(200).json(r);
        });
      }
    });
  });

});

app.delete('/dorms/:dorm/reviews/:user', (req, res) => {
  var dorms = [];
  client.connect(err => {
    if (err) { throw err }
    let db = client.db("DiscoverRPI").collection("reviews");
    let data = {};
    data[req.params.user] = "";
    db.updateOne({_id : req.params.dorm }, {$unset: data}, function(err, r) {
      if (err) { res.status(500).send(); console.log(err); client.close(); return; }
      res.status(200).json(r);  
    });
  });
});

app.delete('/dorms/:dorm/reviews/', (req, res) => {
  var dorms = [];
  client.connect(err => {
    if (err) { throw err }
    let db = client.db("DiscoverRPI").collection("reviews");
    db.deleteOne({_id : req.params.dorm }, function(err, re) {
      if (err) { res.status(500).send(); console.log(err); client.close(); return; }
      if (!(re.deletedCount > 0)) {
        res.status(400).send("Dorm not found");
        client.close();
        return;
      }
      let update = {};
      update["_id"] = req.params.dorm;
      db.insertOne({_id : req.params.dorm }, function(err, r) {
        if (err) { res.status(500).send(); console.log(err); client.close(); return; }
        res.status(200).send("All " + req.params.dorm + " reviews have been deleted.");
      });
    });
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
