var socket = io.connect();

var CANVAS_W = 600;
var CANVAS_H = 600;

var TILE_W;
var TILE_H;

var MAP_SIZE;
var VIEW_SIZE;

var ctx, map;
var here, prev;

function init(data) {
    var can = document.getElementById('canvas');
    can.width = CANVAS_W;
    can.height = CANVAS_H;
    ctx = can.getContext('2d');

    heil.init(ctx);

    MAP_SIZE = data.MAP_SIZE;
    VIEW_SIZE = data.VIEW_SIZE;
    here = new heil.pixel(data.update.me.x, data.update.me.y);
    prev = here;
    map = data.update.view;


    $(document).on('click', function(e) {
        e.preventDefault();
        var rect = ctx.canvas.getBoundingClientRect();
        var pixel = new heil.pixel(e.clientX - rect.left, e.clientY - rect.top);
        var voxel = pixel.voxel().round();
        voxel.x += here.x;
        voxel.y += here.y;
        console.log('move from ' + here.show() + ' to ' + voxel.show(true));
        socket.emit('move', {x: voxel.x, y: voxel.y});
    });

    draw();
}

function draw() {
    console.log('at ' + here.show() + ' (' + prev.show() + ')');
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    var color, cell, hex;
    for(var m in map) {
        cell = map[m];
        if(cell.p) {
            color = 'red';
        } else if(cell.x == prev.x && cell.y == prev.y) {
            color = 'yellow';
        } else {
            color = 'green';
        }
        hex = new heil.fixed(cell.x - here.x, cell.y - here.y, color);
        heil.draw(hex);
    }
}

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
        if(here.x != data.me.x || here.y != data.me.y) {
            prev = here;
            here = new heil.pixel(data.me.x, data.me.y);
        }
        map = data.view;
        draw();
    });
});
