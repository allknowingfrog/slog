module.exports = function(cell, SIZE, VIEW_SIZE) {
    var cells = [];
    for(var x = -SIZE; x <= SIZE; x++) {
        cells.push([]);
        for(var y = -SIZE; y <= SIZE; y++) {
            cells[x + SIZE].push(new cell(this, x, y));
        }
    }

    this.at = at;

    this.view = function(c) {
        return cluster(c, VIEW_SIZE);
    };

    function at(x, y) {
        if(inRange(x, y, SIZE)) {
            return cells[x + SIZE][y + SIZE];
        } else {
            return null;
        }
    }

    function inRange(x, y, range) {
        return x + y >= -range && x + y <= range;
    }

    function cluster(c, range) {
        var range = range || 1;
        var address = c.address();
        var x = address.x;
        var y = address.y;
        var neighbors = [];
        var n;
        for(var xx=x-range; xx<=x+range; xx++) {
            for(var yy=y-range; yy<=y+range; yy++) {
                if(inRange(xx - x, yy - y, range)) {
                    n = at(xx, yy);
                    if(n) neighbors.push(n);
                }
            }
        }
        return neighbors;
    }
}
