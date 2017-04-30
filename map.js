module.exports = function(cell, SIZE, VIEW_SIZE) {
    var cells = [];

    this.DIRS = {
        n:    {x:  0,  y: -1},
        ne:   {x:  1,  y: -1},
        se:   {x:  1,  y:  0},
        s:    {x:  0,  y:  1},
        sw:   {x: -1,  y:  1},
        nw:   {x: -1,  y:  0},
        here: {x:  0,  y:  0}
    };

    map = [];
    for(var x = -SIZE; x <= SIZE; x++) {
        cells.push([]);
        for(var y = -SIZE; y <= SIZE; y++) {
            cells[x + SIZE].push(new cell(this, x, y));
        }
    }

    this.at = function(x, y) {
        return getCell(x, y);
    };

    function getCell(x, y) {
        if(inRange(x, y, SIZE)) {
            return cells[x + SIZE][y + SIZE];
        } else {
            return null;
        }
    }

    this.view = function(c) {
        return cluster(c, VIEW_SIZE);
    };

    function inRange(x, y, range) {
        //TODO fix this
        return true;
        return x + y >= range && x + y < range * 3 + 1;
    }

    function cluster(c, range) {
        var range = range || 1;
        var address = c.address();
        var x = address.x;
        var y = address.y;
        var xRel = 0;
        var yRel = 0;
        var neighbors = [];
        var n;
        for(var xx=x-range; xx<=x+range; xx++) {
            for(var yy=y-range; yy<=y+range; yy++) {
                if(inRange(xRel, yRel, range)) {
                    n = getCell(xx, yy);
                    if(n) neighbors.push(n);
                }
                yRel++;
            }
            yRel = 0;
            xRel++;
        }
        return neighbors;
    };
}
