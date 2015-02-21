module.exports = function(x, y, terrain, validCoords) {
    this.x = x;
    this.y = y;
    this.terrain = 'land';
    this.passable = true;
    this.object = {};
    this.player;
    this.outside = true;
    this.lit = true;

    this.makeTerrain = function(terrain) {
        switch(terrain) {
            case 'land':
                this.terrain = terrain;
                this.passable = true;
                this.outside = true;
                break;
            case 'water':
                this.terrain = terrain;
                this.passable = false;
                this.outside = true;
                break;
            case 'wall':
                this.terrain = terrain;
                this.passable = false;
                this.outside = false;
                break;
            case 'cave':
                this.terrain = terrain;
                this.passable = true;
                this.outside = false;
                break;
            case 'woods':
                this.terrain = terrain;
                this.passable = false;
                this.outside = true;
                break;
        }
        this.checkLit();
        var xx, yy;
        for(var dir in dirs) {
            xx = this.x + dirs[dir].x;
            yy = this.y + dirs[dir].y;
            if(validCoords(xx, yy)) map[xx][yy].checkLit();
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
        if(this.outside) {
            this.lit = true;
            return true;
        } else {
            this.lit = false;
        }
        var xx, yy;
        for(var dir in dirs) {
            xx = this.x + dirs[dir].x;
            yy = this.y + dirs[dir].y;
            if(validCoords(xx, yy) && map[xx][yy].outside) {
                this.lit = true;
                return true;
            }
        }

        return false;
    };
}
