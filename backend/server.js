// server init + mods
var app = require('express')();
var http = require('http').Server(app);
const axios = require('axios').default;

// server main route handler
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// server dorm route handler
app.get('/dorms', (req, res) => {
    res.status(200).json({
      "result": true
    });
});

// server dorm itme route handler
app.get('/dorms/:q', (req, res) => {
  switch(q) {
    case "name":
      res.status(200).json({
        "result": true
      });
      break;
    case "price":
      res.status(200).json({
        "result": true
      });
      break;
    case "reviews":
      res.status(200).json({
        "result": true
      });
      break;
    default:
      break;
  }
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

// start server
http.listen(3000, function () {
    console.log('Server up on *:3000');
});
