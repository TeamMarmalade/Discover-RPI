// server init + mods
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
const axios = require('axios').default;
const fs = require('fs');

// This will be mongo in the future:
var dorms;
fs.readFile('./dorms.json', 'utf8', (err, data) => {
  if (err) {
      console.log(`Error reading file from disk: ${err}`);
  } else {
    // parse JSON string to JSON object
    dorms = JSON.parse(data);
  }
});

// Load static
app.use(express.static(__dirname + '/dist/frontend'));

// server dorm route handler
app.get('/dorms', (req, res) => {
  // var arr = [];
  // for(var key in dorms["dorms"]) {
  //   var dorm = dorms["dorms"][key];
  //   arr.push(dorm["name"]);
  // }
  res.status(200).json({"dorms": dorms["dorms"]})
});

// server dorm item route handler
app.get('/dorms/:dorm', (req, res) => {
  // can be called by either the common or official dorm name
  for(var key in dorms["dorms"]) {
    var dorm = dorms["dorms"][key];
    if (dorm.name.common === req.params.dorm || dorm.name.official === req.params.dorm) {
      res.status(200).json(dorm);
    }
  }
  res.status(404).send();
});

app.put('/dorms/reviews/:id', (req, res) => {
  res.status(200).json({
    "added": true
  })
});

app.delete('/dorms/reviews/:id', (req, res) => {
  res.status(200).json({
    "removed": true
  })
});

// server main route handler
app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/frontend/index.html');
});

// start server
http.listen(3000, function () {
  console.log('Server up on *:3000');
});
