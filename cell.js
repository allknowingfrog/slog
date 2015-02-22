module.exports = function(x, y, structure, validCoords) {
    this.x = x;
    this.y = y;
    this.structure = new structure(this);
    this.object = {};
    this.player;

    this.outside = true;
    this.lit = true;

    this.makeStructure = function(structure) {
        this.structure = new structure(this);
        this.checkLit();
        var xx, yy;
        for(var dir in dirs) {
            xx = this.x + dirs[dir].x;
            yy = this.y + dirs[dir].y;
            if(validCoords(xx, yy)) map[xx][yy].checkLit();
        }
        var neighbors = this.getNeighbors(LIGHT_RANGE);
        for(var n in neighbors) {
            neighbors[n].checkLit();
        }
    };

    this.sendPlayer = function(x, y) {
        if(validCoords(x, y)) {
            var dest = map[x][y];
            if(dest.structure.passable && !dest.player) {
                dest.player = this.player;
                this.player.cell = dest;
                this.player = null;
            }
        }
    };

    this.checkLit = function() {
        this.lit = false;
        if(this.outside) {
            this.lit = true;
            return;
        }
        var neighbors = this.getNeighbors(LIGHT_RANGE);
        for(var n in neighbors) {
            if(neighbors[n].outside || neighbors[n].object.lightSource) {
                this.lit = true;
                return;
            }
        }
    };

    this.getNeighbors = function(range) {
        var neighbors = [];
        var range = range || 1;
        var xRel = 0;
        var yRel = 0;
        for(var xx=this.x-range; xx<=this.x+range; xx++) {
            for(var yy=this.y-range; yy<=this.y+range; yy++) {
                if(Math.abs(xRel-yRel) <= range && validCoords(xx, yy)) {
                    neighbors[neighbors.length] = map[xx][yy];
                }
                yRel++;
            }
            yRel = 0;
            xRel++;
        }
        return neighbors;
    };
}
