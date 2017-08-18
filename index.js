const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

const server = app.listen(8000);

app.get('/', (req, res) => {
  res.sendFile('index.html');
});

const io = require('socket.io')(server);

io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')('d496325ffadd4e60aa13d26cccf2e91d');

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {

    // Get a reply from API.AI

    let apiaiReq = apiai.textRequest(text, {
      sessionId: '123'
    });

    apiaiReq.on('response', (response) => {
      let aiText = response.result.fulfillment.speech;
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});