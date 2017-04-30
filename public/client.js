var socket = io.connect();

var CANVAS_W;
var CANVAS_H;

var TILE_W;
var TILE_H;

var MAP_SIZE;
var VIEW_SIZE;
var DIRS;

var ctx, view;

function init(data) {
    MAP_SIZE = data.MAP_SIZE;
    VIEW_SIZE = data.VIEW_SIZE;
    DIRS = data.DIRS;
    view = data.view;

    var can = document.getElementById('canvas');
    can.width = CANVAS_W;
    can.height = CANVAS_H;
    ctx = can.getContext('2d');

    $(document).on('click', function(e) {
        e.preventDefault();
        //TODO click on things
    });
}

function draw() {
    console.log(JSON.stringify(view));
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
        view = data;
        draw();
    });
});
