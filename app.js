var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');

var player = require('./player.js');

//globals
users = {};
players = {};

CANVAS_W = 600;
CANVAS_H = 600;
TILE_W = 50;
MAP_SIZE = 101;
VIEW_RANGE = 4;

TPS = 60;
FPS = 15;

dirs = {
    nw: {x: -1,  y: -1},
    n:  {x:  0,  y: -1},
    ne: {x:  1,  y:  0},
    se: {x:  1,  y:  1},
    s:  {x:  0,  y:  1},
    sw: {x: -1,  y:  0}
};

map = [];
for(var x=0; x<MAP_SIZE; x++) {
    map[x] = [];
    for(var y=0; y<MAP_SIZE; y++) {
        map[x][y] = {
            tile: "green" 
        };
    }
}

function validCoords(x, y) {
    if(x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
        return true;
    } else {
        return false;
    }
}

server.listen(3000);

app.use(express.static(__dirname + '/sprites'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    socket.on('login', function(data, callback) {
        if(data in users) {
            callback(false);
        } else if(data) {
            socket.nickname = data;
            users[socket.nickname] = socket;
            players[socket.nickname] = new player(socket.nickname, 5, 5, validCoords);
            var view = players[socket.nickname].getView();
            callback({
                CANVAS_W: CANVAS_W,
                CANVAS_H: CANVAS_H,
                TILE_W: TILE_W,
                FPS: FPS,
                dirs: dirs,
                view: view
            });
        } else {
            callback(false);
        }
    });
    socket.on('keyPress', function(data) {
        players[socket.nickname].nextMove = data;
    });
    socket.on('disconnect', function(data) {
        if(socket.nickname) {
            delete users[socket.nickname];
            delete players[socket.nickname];
        } else {
            return;
        }
    });
});

setInterval(gameLoop, 1000/FPS);

function gameLoop() {
    for(var p in players) {
        players[p].move();
    }

    var view;
    for(var p in players) {
        view = players[p].getView();
        users[p].emit('update', view);
    }
}
