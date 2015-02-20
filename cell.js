module.exports = function(x, y, terrain, validCoords) {
    this.x = x;
    this.y = y;
    this.terrain;
    this.passable;
    this.structure;
    this.player;
    this.outside;

    this.makeTerrain = function(terrain) {
        switch(terrain) {
            case "land":
                this.terrain = terrain;
                this.passable = true;
                this.outside = true;
                break;
            case "water":
                this.terrain = terrain;
                this.passable = false;
                this.outside = true;
                break;
            case "wall":
                this.terrain = terrain;
                this.passable = false;
                this.outside = false;
                break;
            case "cave":
                this.terrain = terrain;
                this.passable = true;
                this.outside = false;
                break;
        }
    };

    this.sendPlayer = function(x, y) {
        if(validCoords(x, y)) {
            var dest = map[x][y];
            if(dest.passable && !dest.player) {
                dest.player = this.player;
                this.player.x = x;
                this.player.y = y;
                this.player = null;
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    };

    this.makeTerrain(terrain);
}
