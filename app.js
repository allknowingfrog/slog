var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');

var player = require('./player.js');
var cell = require('./cell.js');

//objects
var shovel = require('./objects/shovel.js');

//globals
users = {};
players = {};

MAP_SIZE = 101;
MAX_VIEW = 9;
MIN_VIEW = 2;
LIGHT_RANGE = 2;

TPS = 20;

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
        map[x][y] = new cell(x, y);
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
            players[socket.nickname] = new player(socket.nickname, map[5][5]);
            var p = players[socket.nickname];
            p.invAdd(new shovel(false));
            p.invAdd(new shovel(true));
            var view = players[socket.nickname].getView();
            var inventory = players[socket.nickname].getInventory();
            callback({
                login: data,
                MAX_VIEW: MAX_VIEW,
                dirs: dirs,
                view: view,
                inventory: inventory
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
    for(var p in players) {
        players[p].move();
    }

    var data = {};
    for(var p in players) {
        data.view = players[p].getView();
        data.inventory = players[p].getInventory();
        users[p].emit('update', data);
    }
}
