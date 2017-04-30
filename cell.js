module.exports = function(map, x, y) {
    var player = null;

    this.address = function() {
        return {x: x, y: y};
    };

    this.sendPlayer = function(cell) {
        if(cell.receivePlayer(player)) {
            player = null;
            return true;
        } else {
            return false;
        }
    };

    this.receivePlayer = function(p) {
        if(true) {
            p.cell = this;
            player = p;
            return true;
        } else {
            return false;
        }
    };

    this.neighbor = function(cell, dir) {
        var x = cell.x + map.DIRS[dir].x;
        var y = cell.y + map.DIRS[dir].y;
        return map.at(x, y);
    };

    this.view = function() {
        return map.view(this);
    };

    this.encode = function() {
        return {
            x: x,
            y: y,
            p: player !== null
        };
    }
}
