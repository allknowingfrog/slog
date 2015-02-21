module.exports = function(nickname, cell, validCoords) {
    this.nickname = nickname;
    this.cell = cell;
    this.cell.player = this;
    this.nextMove = {};
    this.inventory = [];

    this.getView = function() {
        var view = [];
        var x = this.cell.x;
        var y = this.cell.y;
        var xRel, yRel;
        for(var xx=x-VIEW_RANGE; xx<=x+VIEW_RANGE; xx++) {
            xRel = view.length;
            view[xRel] = [];
            for(var yy=y-VIEW_RANGE; yy<=y+VIEW_RANGE; yy++) {
                yRel = view[xRel].length;
                view[xRel][yRel] = {};
                if(Math.abs(xRel-yRel) <= VIEW_RANGE && validCoords(xx, yy)) {
                    if(map[xx][yy].outside || (xx >= x-INSIDE_RANGE && xx <= x+INSIDE_RANGE && yy >= y-INSIDE_RANGE && yy <= y+INSIDE_RANGE && Math.abs(xRel-yRel) <= INSIDE_RANGE)) {
                        view[xRel][yRel].terrain = map[xx][yy].terrain;
                        if(map[xx][yy].player) view[xRel][yRel].player = true;
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
            var inv = this.nextMove.inv;
            if(dir) {
                var xx = this.cell.x + dir.x;
                var yy = this.cell.y + dir.y;
                if(validCoords(xx, yy)) {
                    if(action == 'move') {
                        map[this.cell.x][this.cell.y].sendPlayer(xx, yy);
                    } else if(action == 'use') {
                        this.inventory[inv].use(map[xx][yy]);
                    }
                }
            }
            this.nextMove = null;
        }
    };

    this.invAdd = function(obj) {
        this.inventory[this.inventory.length] = obj;
    };
}
