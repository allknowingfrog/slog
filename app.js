var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var map = require('./map.js');
var cell = require('./cell.js');
var player = require('./player.js');

//globals
users = {};
players = {};

MAP_SIZE = 7;
VIEW_SIZE = 2;

TURN_LENGTH = 5;

map = new map(cell, MAP_SIZE, VIEW_SIZE);
map.at(0, 0).view();

server.listen(3000);

console.log('Listening on 3000');

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    console.log('New socket ' + socket.id);
    socket.on('login', function(data, callback) {
        if(data in users) {
            callback(false);
        } else if(data) {
            users[socket.id] = socket;
            var p = new player(socket.id, data);
            players[socket.id] = p;
            //TODO better spawn
            map.at(0, 0).receivePlayer(p);
            callback({
                login: data,
                MAP_SIZE: MAP_SIZE,
                VIEW_SIZE: VIEW_SIZE,
                TURN_LENGTH: TURN_LENGTH,
                DIRS: map.DIRS,
                update: p.view()
            });
        } else {
            callback(false);
        }
    });
    socket.on('move', function(data) {
        console.log('received move');
        players[socket.id].nextMove = data;
    });
    socket.on('disconnect', function(data) {
        delete users[socket.id];
        if(players.hasOwnProperty(socket.id)) {
            players[socket.id].cell.player = null;
            delete players[socket.id];
        };
    });
});

setInterval(gameLoop, 1000 * TURN_LENGTH);

function gameLoop() {
    for(var p in players) {
        players[p].move();
    }

    for(var p in players) {
        users[p].emit('update', players[p].view());
    }
}
