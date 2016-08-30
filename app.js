var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');

var player = require('./player.js');
var cell = require('./cell.js');

//globals
users = {};
players = {};
updates = [];

MAP_SIZE = 101;
MAX_VIEW = 9;

TPS = 20;
COOL_DOWN = 500;

running = false;

dirs = {
    n:    {x:  0,  y: -1},
    ne:   {x:  1,  y: -1},
    se:   {x:  1,  y:  0},
    s:    {x:  0,  y:  1},
    sw:   {x: -1,  y:  1},
    nw:   {x: -1,  y:  0},
    here: {x:  0,  y:  0}
};

map = [];
for(var x=0; x<MAP_SIZE; x++) {
    map[x] = [];
    for(var y=0; y<MAP_SIZE; y++) {
        map[x][y] = new cell(x, y);
    }
}

server.listen(3000);

io.sockets.on('connection', function(socket) {
    socket.on('login', function(data, callback) {
        if(data in users) {
            callback(false);
        } else if(data) {
            socket.nickname = data;
            users[socket.nickname] = socket;
            players[socket.nickname] = new player(socket.nickname, map[5][5]);
            var view = players[socket.nickname].getView();
            callback({
                login: data,
                MAX_VIEW: MAX_VIEW,
                dirs: dirs,
                view: view
            });
        } else {
            callback(false);
        }
    });
    socket.on('move', function(data) {
        players[socket.nickname].bearing = data;
        updates.push(player);
    });
    socket.on('disconnect', function(data) {
        if(socket.nickname) {
            players[socket.nickname].cell.player = null;
            delete users[socket.nickname];
            delete players[socket.nickname];
        } else {
            return;
        }
    });
});

setInterval(gameLoop, 1000/TPS);

function gameLoop() {
    var now = Date.now();

    var player;
    for(var p in updates) {
        player = players[p];
        if(player.initiative > now) {
            player.move();
            player.initiative = now + COOL_DOWN;
        }
    }

    for(var p in players) {
        users[p].emit('update', players[p].getView());
    }
}
