module.exports = function(x, y, terrain, validCoords) {
    this.x = x;
    this.y = y;
    this.terrain;
    this.passable;
    this.object = {};
    this.player;
    this.outside;
    this.lit;

    this.makeTerrain = function(terrain) {
        switch(terrain) {
            case "land":
                this.terrain = terrain;
                this.passable = true;
                this.outside = true;
                this.lit = true;
                break;
            case "water":
                this.terrain = terrain;
                this.passable = false;
                this.outside = true;
                this.lit = true;
                break;
            case "wall":
                this.terrain = terrain;
                this.passable = false;
                this.outside = false;
                this.lit = false;
                break;
            case "cave":
                this.terrain = terrain;
                this.passable = true;
                this.outside = false;
                this.lit = false;
                break;
        }
    };

    this.sendPlayer = function(x, y) {
        if(validCoords(x, y)) {
            var dest = map[x][y];
            if(dest.passable && !dest.player) {
                dest.player = this.player;
                this.player.cell = dest;
                this.player = null;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    this.checkLit = function() {
        this.lit = false;
        var xx, yy;
        for(var dir in dirs) {
            xx = this.x + dir.x;
            yy = this.y + dir.y;
            if(map[xx][yy].outside || map[xx][yy].object.lightSource) {
                this.lit = true;
            }
        }
    };

    this.makeTerrain(terrain);
}
