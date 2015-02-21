module.exports = function(nickname, x, y, validCoords) {
    this.nickname = nickname;

    this.x = x;
    this.y = y;

    this.nextMove = '';

    map[x][y].player = this;

    this.getView = function() {
        var view = [];
        var xRel, yRel;
        for(var x=this.x - VIEW_RANGE; x<=this.x + VIEW_RANGE; x++) {
            xRel = view.length;
            view[xRel] = [];
            for(var y=this.y - VIEW_RANGE; y<=this.y + VIEW_RANGE; y++) {
                yRel = view[xRel].length;
                view[xRel][yRel] = {};
                if(Math.abs(xRel-yRel) <= VIEW_RANGE && validCoords(x, y)) {
                    if(map[x][y].outside || (x >= this.x - INSIDE_RANGE && x <= this.x + INSIDE_RANGE && y >= this.y - INSIDE_RANGE && y <= this.y + INSIDE_RANGE && Math.abs(xRel-yRel) <= INSIDE_RANGE)) {
                        view[xRel][yRel].terrain = map[x][y].terrain;
                        if(map[x][y].player) view[xRel][yRel].player = true;
                    }
                }
            }
        }

        return view;
    };

    this.move = function() {
        if(this.nextMove) {
            var action = this.nextMove.action;
            var dir = dirs[this.nextMove.dir];
            if(dir) {
                var xx = this.x + dir.x;
                var yy = this.y + dir.y;
                if(validCoords(xx, yy)) {
                    if(action == 'move') {
                        map[this.x][this.y].sendPlayer(xx, yy);
                    } else if(action == 'land') {
                        map[xx][yy].makeTerrain('land');
                    } else if(action == 'water') {
                        map[xx][yy].makeTerrain('water');
                    } else if(action == 'wall') {
                        map[xx][yy].makeTerrain('wall');
                    } else if(action == 'cave') {
                        map[xx][yy].makeTerrain('cave');
                    }
                }
            }
            this.nextMove = '';
        }
    };
}
