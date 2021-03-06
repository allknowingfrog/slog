var socket = io.connect();

var canvas = {};
var CANVAS_W;
var CANVAS_H;
var ctx = {};

var TILE_W;
var TILE_H;

var MAX_VIEW;
var view;
var dirs;
var action;
var inventory;
var inv = 0;

var keyBind;

//dvorak
var dvorak = {
    actions: {
        use: 32, //space
        toss: 116 //toss
    },
    dirs: {
        nw: 44, //,
        n: 46, //.
        ne: 112, //p
        se: 117, //u
        s: 101, //e
        sw: 111, //a
        here: 104 //h
    },
    inventory: {
        0: 49, //1
        1: 50, //2
        2: 51, //3
        3: 52, //4
        4: 53, //5
        5: 54, //6
        6: 55, //7
        7: 56, //8
        8: 57, //9
        9: 48 //0
    }
};

//qwerty
var qwerty = {
    actions: {
        use: 32, //space
        toss: 116 //toss
    },
    dirs: {
        nw: 119, //w
        n: 101, //e
        ne: 114, //r
        se: 102, //f
        s: 100, //d
        sw: 115, //s
        here: 104 //h
    },
    inventory: {
        0: 49, //1
        1: 50, //2
        2: 51, //3
        3: 52, //4
        4: 53, //5
        5: 54, //6
        6: 55, //7
        7: 56, //8
        8: 57, //9
        9: 48 //0
    }
};

var tiles = {
    player: new Image(),
    soil: new Image(),
    water: new Image(),
    grass: new Image(),
    woods: new Image(),
    stone: new Image(),
    item: new Image(),
    shovel: new Image(),
    torch: new Image()
};
tiles.player.src = 'sprites/player.svg';
tiles.soil.src = 'sprites/soil.svg';
tiles.water.src = 'sprites/water.svg';
tiles.grass.src = 'sprites/grass.svg';
tiles.woods.src = 'sprites/woods.svg';
tiles.stone.src = 'sprites/stone.svg';
tiles.item.src = 'sprites/item.svg';
tiles.shovel.src = 'sprites/redHex.svg';
tiles.torch.src = 'sprites/redHex.svg';

function keyPress(key) {
    var aBinds = keyBind.actions;
    for(var a in aBinds) {
        if(aBinds[a] == key) {
            action = a;
            return true;
        }
    }

    var iBinds = keyBind.inventory;
    for(var i in iBinds) {
        if(iBinds[i] == key) {
            inv = i;
            return true;
        }
    }

    var dBinds = keyBind.dirs;
    for(var d in dBinds) {
        if(dBinds[d] == key) {
            var command = {};
            if(action) {
                command.action = action;
                command.dir = d;
                command.inv = inv;
                action = '';
            } else {
                command.action = 'move';
                command.dir = d;
            }
            socket.emit('keyPress', command);
            return true;
        }
    }
}

//init functions
function init(data) {
    MAX_VIEW = data.MAX_VIEW;
    dirs = data.dirs;
    view = data.view;

    var doQwerty = localStorage.getItem('qwerty');
    setQwerty(doQwerty);

    canvas.main = document.getElementById('canvas');
    ctx.main = canvas.main.getContext('2d');
    canvas.inv = document.getElementById('invcan');
    ctx.inv = canvas.inv.getContext('2d');

    setCanvasWidth(localStorage.getItem('canvas-width'));

    $(document).keypress(function(e) {
        e.preventDefault();
        keyPress(e.which);
    });
}

function setCanvasWidth(width) {
    CANVAS_W = width || 600;
    localStorage.setItem('canvas-width', width);
    TILE_W = CANVAS_W / (2 + (.75 * MAX_VIEW * 2));
    TILE_H = Math.sqrt(3)/2 * TILE_W;
    CANVAS_H = TILE_H * 2 * (MAX_VIEW + 1);

    canvas.main.width = CANVAS_W;
    canvas.main.height = CANVAS_H;
    canvas.inv.width = TILE_W * 2;
    canvas.inv.height = CANVAS_H;

    return "canvas width set: " + width;
}

function setQwerty(toggle) {
    if(toggle == 1) {
        keyBind = qwerty;
        localStorage.setItem('qwerty', 1);
        return localStorage.getItem('qwerty');
    } else {
        keyBind = dvorak;
        localStorage.setItem('qwerty', 0);
        return localStorage.getItem('qwerty');
    }
}

function draw() {
    var xStart = (CANVAS_W / 2) - (TILE_W / 2);
    var yStart = (CANVAS_H / 2) - (TILE_H / 2);
    var origin = Math.floor(view.length/2);
    var structure, tile, player, xRel, yRel, xDraw, yDraw;
    ctx.main.clearRect(0, 0, CANVAS_W, CANVAS_H);
    for(var x=0; x<view.length; x++) {
        for(var y=0; y<view.length; y++) {
            structure = view[x][y].structure;
            if(structure) {
                switch(structure) {
                    case 'soil':
                        switch(view[x][y].level) {
                            case 0:
                                tile = tiles.soil;
                                break;
                            case 1:
                                tile = tiles.grass;
                                break;
                            case 2:
                                tile = tiles.woods;
                                break;
                        }
                        break;
                    case 'water':
                        tile = tiles.water;
                        break;
                    case 'stone':
                        tile = tiles.stone;
                        break;
                }

                xRel = x - origin;
                yRel = y - origin;
                xDraw = xStart + (xRel * (.75 * TILE_W));
                yDraw = yStart + ((yRel + (xRel / 2)) * TILE_H);
                ctx.main.drawImage(tile, xDraw, yDraw, TILE_W, TILE_H);
                if(view[x][y].item) {
                    ctx.main.drawImage(tiles.item, xDraw, yDraw, TILE_W, TILE_H);
                }
                if(view[x][y].player) {
                    ctx.main.drawImage(tiles.player, xDraw, yDraw, TILE_W, TILE_H);
                }
            }
        }
    }

    xDraw = TILE_W / 2;
    yDraw = TILE_H / 2;
    ctx.inv.clearRect(0, 0, TILE_W * 2, CANVAS_H);
    for(var i=0; i<inventory.length; i++) {
        structure = inventory[i];
        ctx.inv.drawImage(tiles[structure], xDraw, yDraw, TILE_W, TILE_H);
        yDraw += TILE_H;
    }
    ctx.inv.drawImage(tiles.player, xDraw, (TILE_H / 2) + (TILE_H * inv), TILE_W, TILE_H);
}

//start game
$(document).ready(function() {
    $('#nickname').val(localStorage.getItem('login'));
    $('#login').submit(function(e) {
        e.preventDefault();
        socket.emit('login', $('#nickname').val(), function(data) {
            if(data) {
                localStorage.setItem('login', data.login);
                $('#loginDiv').hide();
                $('#gameDiv').show();
                init(data);
            } else {
                $('#output').html('That username is already taken! Try again.');
            }
        });
        $('#nickname').val('');
    });
    socket.on('update', function(data) {
        view = data.view;
        inventory = data.inventory;
        draw();
    });
});
