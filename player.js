module.exports = function(nickname, x, y, validCoords) {
    this.nickname = nickname;

    this.x = x;
    this.y = y;

    this.nextMove = '';

    map[x][y].player = this;

    this.getView = function() {
        var xMin = this.x - VIEW_RANGE;
        var xMax = this.x + VIEW_RANGE;
        var yMin = this.y - VIEW_RANGE;
        var yMax = this.y + VIEW_RANGE;
        var view = [];
        var xRel, yRel;
        for(var x=xMin; x<=xMax; x++) {
            xRel = view.length;
            view[xRel] = [];
            for(var y=yMin; y<=yMax; y++) {
                yRel = view[xRel].length;
                if(Math.abs(xRel-yRel) <= VIEW_RANGE && validCoords(x, y)) {
                    view[xRel][yRel] = {
                        terrain: map[x][y].terrain
                    }
                    if(map[x][y].player) view[xRel][yRel].player = true;
                } else {
                    view[xRel][yRel] = {};
                }
            }
        }

        return view;
    };

    this.move = function() {
        if(this.nextMove) {
            if(dirs[this.nextMove]) {
                var dir = dirs[this.nextMove];
                var xx = this.x + dir.x;
                var yy = this.y + dir.y;
                map[this.x][this.y].sendPlayer(xx, yy);
            } else if(this.nextMove == 'action') {
                map[this.x][this.y].makeTerrain('water');
            }
            this.nextMove = '';
        }
    };
}
