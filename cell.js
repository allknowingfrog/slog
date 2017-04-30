module.exports = function(map, x, y) {
    var player = null;

    this.address = function() {
        return {x: x, y: y};
    };

    this.sendPlayer = function(x, y) {
        var cell = map.at(x, y);
        if(this.neighbor(cell) && cell.receivePlayer(player)) {
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

    this.neighbor = function(cell) {
        var a = cell.address();
        return a.x - x + a.y - y <= 1;
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
