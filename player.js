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
        for(var xx=x-MAX_VIEW; xx<=x+MAX_VIEW; xx++) {
            xRel = view.length;
            view[xRel] = [];
            for(var yy=y-MAX_VIEW; yy<=y+MAX_VIEW; yy++) {
                yRel = view[xRel].length;
                view[xRel][yRel] = {};
                if(Math.abs(xRel-yRel) <= MAX_VIEW && validCoords(xx, yy)) {
                    if(map[xx][yy].lit || (xx >= x-MIN_VIEW && xx <= x+MIN_VIEW && yy >= y-MIN_VIEW && yy <= y+MIN_VIEW && Math.abs(xRel-yRel) <= MIN_VIEW)) {
                        view[xRel][yRel].outside = map[xx][yy].outside;
                        view[xRel][yRel].structure = map[xx][yy].structure.type;
                        view[xRel][yRel].level = map[xx][yy].structure.level;
                        if(map[xx][yy].player) view[xRel][yRel].player = true;
                    }
                }
            }
        }

        return view;
    };

    this.getInventory = function() {
        var inv = [];
        for(var i=0; i<this.inventory.length; i++) {
            inv[inv.length] = this.inventory[i].id;
        }

        return inv;
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
                        if(this.inventory[inv]) this.inventory[inv].use(map[xx][yy]);
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
