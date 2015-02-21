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
            if(dirs[this.nextMove]) {
                var dir = dirs[this.nextMove];
                var xx = this.x + dir.x;
                var yy = this.y + dir.y;
                map[this.x][this.y].sendPlayer(xx, yy);
            } else if(this.nextMove == 'action') {
            } else if(this.nextMove == 'land') {
                map[this.x][this.y].makeTerrain('land');
            } else if(this.nextMove == 'water') {
                map[this.x][this.y].makeTerrain('water');
            } else if(this.nextMove == 'wall') {
                map[this.x][this.y].makeTerrain('wall');
            } else if(this.nextMove == 'cave') {
                map[this.x][this.y].makeTerrain('cave');
            }
            this.nextMove = '';
        }
    };
}
