module.exports = function(nickname, x, y, validCoords) {
    this.nickname = nickname;

    this.x = x;
    this.y = y;

    this.nextMove = '';

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
                    view[xRel][yRel] = map[x][y];
                } else {
                    view[xRel][yRel] = "";
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
                if(validCoords(xx, yy)) {
                    this.x = xx;
                    this.y = yy;
                }
            } else if(this.nextMove == 'action') {
                map[this.x][this.y].tile = 'blue';
            }
            this.nextMove = '';
        }
    };
}
