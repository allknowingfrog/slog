module.exports = function(x, y) {
    this.soil = require('./structures/soil.js');
    this.water = require('./structures/water.js');
    this.stone = require('./structures/stone.js');

    this.x = x;
    this.y = y;
    this.structure = new this.soil(this);
    this.object = {};
    this.player;

    this.outside = true;
    this.lit = true;

    this.makeStructure = function(structure, level) {
        switch(structure) {
            case 'soil':
                this.structure = new this.soil(this, level);
                break;
            case 'water':
                this.structure = new this.water(this);
                break;
            case 'stone':
                this.structure = new this.stone(this);
                break;
        }
        this.checkLit();
        var xx, yy;
        for(var dir in dirs) {
            xx = this.x + dirs[dir].x;
            yy = this.y + dirs[dir].y;
            if(this.validCoords(xx, yy)) map[xx][yy].checkLit();
        }
        var neighbors = this.getNeighbors(LIGHT_RANGE);
        for(var n in neighbors) {
            neighbors[n].checkLit();
        }
    };

    this.raiseTerrain = function() {
        switch(this.structure.type) {
            case 'water':
                this.makeStructure('soil', 1);
                break;
            case 'soil':
                if(this.structure.level == 1) {
                    this.makeStructure('soil', 0);
                } else {
                    this.makeStructure('stone');
                }
                break;
        }
    };

    this.lowerTerrain = function() {
        switch(this.structure.type) {
            case 'stone':
                this.makeStructure('soil', 0);
                break;
            case 'soil':
                if(this.structure.level == 0) {
                    this.makeStructure('soil', 1);
                } else {
                    this.makeStructure('water');
                }
                break;
        }
    };

    this.sendPlayer = function(x, y) {
        if(this.validCoords(x, y)) {
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
                if(Math.abs(xRel-yRel) <= range && this.validCoords(xx, yy)) {
                    neighbors[neighbors.length] = map[xx][yy];
                }
                yRel++;
            }
            yRel = 0;
            xRel++;
        }
        return neighbors;
    };

    this.validCoords = function(x, y) {
        if(x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
            return true;
        } else {
            return false;
        }
    };
}
