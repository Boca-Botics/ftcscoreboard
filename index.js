const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const ip = require('ip');
const fs = require('fs');

const app = express();
const server = createServer(app);
const io = new Server(server);

var time = 0;
var settings = {
  'time': 0,
  'hb': 0,
  'lb': 0,
  'net': 0,
  'hc': 0,
  'lc': 0,
  'map': 0,
  'mip': 0,
  'lo': 0,
  'loau': 0,
  'bgcolor': '#FF0000',
  'silent': 0,
  'total': 0
}

app.use(express.static('public'))

io.on('connection', (socket) => {
  //console.log('a user connected');

  socket.on('reload', (msg) => {
    io.emit('reload');
  })

  socket.on('alert', (msg) => {
    io.emit('alert', msg);
  })

  socket.on('shutdown', () => {
    console.warn('User request server shutdown. Goodbye 👋!')
    server.close(() => {
      process.exit(0)
    })
    process.exit(0)
  })

  socket.on('starttimer', (msg) => {
    settings.time = msg;
  })

  socket.on('stoptimer', (msg) => {
    settings.time = 0;
  })

  socket.on('updatescores', (msg) => {
    var hangpoints = 0;

    settings = {
      'time': settings.time,
      'hb': msg.hb,
      'lb': msg.lb,
      'net': msg.net,
      'hc': msg.hc,
      'lc': msg.lc,
      'map': msg.map,
      'mip': msg.mip,
      'lo': msg.lo,
      'bgcolor': msg.bgcolor,
      'silent': msg.silent,
      'dev': msg.dev,
      'driver': msg.driver,
      'operator': msg.operator,
      'human': msg.human,
      'coach': msg.coach
    }

    if (msg.lo == "None") hangpoints = hangpoints + 0;
    if (msg.lo == "Observation Zone" || msg.lo == "Level 1") hangpoints = hangpoints + 3;
    if (msg.lo == "Level 2") hangpoints = hangpoints + 15;
    if (msg.lo == "Level 3") hangpoints = hangpoints + 30;

    if (msg.loau == "None") hangpoints = hangpoints + 0;
    if (msg.loau == "Observation Zone" || msg.lo == "Level 1") hangpoints = hangpoints + 3;
    if (msg.loau == "Level 2") hangpoints = hangpoints + 15;
    if (msg.loau == "Level 3") hangpoints = hangpoints + 30;

    settings.total = ((msg.hb * 8) + (msg.lb * 4) + (msg.net * 2) + (msg.hc * 10) + (msg.lc * 6) + hangpoints) - ((msg.map * 15) + (msg.mip * 5))

    io.emit('updateall', settings)
  })
});

function updateLoop() {
  //console.log('updateloop')

  if (settings.time > 0) {
    settings.time--
  }

  io.emit('updateall', settings)
}

setInterval(updateLoop, 1000)

server.listen(3000, () => {
  console.log(`Server started, accessable at ${ip.address()}:3000. Administrator page is located at: ${ip.address()}:3000/admin.html`);
});