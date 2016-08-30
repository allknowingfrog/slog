module.exports = function(x, y) {
    this.x = x;
    this.y = y;
    this.structure = false;
    this.player = null;

    this.passable = function() {
        return !this.structure && !this.player;
    };

    this.neighbors = function(range) {
        var neighbors = [];
        var range = range || 1;
        var xRel = 0;
        var yRel;
        for(var xx=this.x-range; xx<=this.x+range; xx++) {
            yRel = 0;
            for(var yy=this.y-range; yy<=this.y+range; yy++) {
                if(Math.abs(xRel-yRel) <= MAX_VIEW && this.cell.validCoords(xx, yy)) {
                    neighbors[neighbors.length] = map[xx][yy];
                }
                yRel++;
            }
            xRel++;
        }

        return neighbors;
    };

    this.neighbor = function(dir) {
        var x = this.x + dirs[dir].x;
        var y = this.y + dirs[dir].y;
        if(this.validCoords(x, y)) {
            return map[x][y];
        } else {
            return false;
        }
    };

    this.validCoords = function(x, y) {
        if(x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
            return true;
        } else {
            return false;
        }
    };
}
