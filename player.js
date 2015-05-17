module.exports = function(nickname, cell) {
    this.nickname = nickname;
    this.cell = cell;
    this.cell.player = this;
    this.nextMove = {};
    this.inventory = [];

    this.getView = function() {
        var view = [];
        var x = this.cell.x;
        var y = this.cell.y;
        var offset = Math.floor((MAX_VIEW-MIN_VIEW));
        var xRel, yRel;
        for(var xx=x-MAX_VIEW; xx<=x+MAX_VIEW; xx++) {
            xRel = view.length;
            view[xRel] = [];
            for(var yy=y-MAX_VIEW; yy<=y+MAX_VIEW; yy++) {
                yRel = view[xRel].length;
                view[xRel][yRel] = {};
                if(xRel+yRel >= MAX_VIEW && xRel+yRel < (MAX_VIEW*3)+1 && this.cell.validCoords(xx, yy)) {
                    if(map[xx][yy].lit || (xx >= x-MIN_VIEW && xx <= x+MIN_VIEW && yy >= y-MIN_VIEW && yy <= y+MIN_VIEW && (xRel-offset)+(yRel-offset) >= MIN_VIEW && (xRel-offset)+(yRel-offset) < (MIN_VIEW*3)+1)) {
                        view[xRel][yRel].outside = map[xx][yy].outside;
                        view[xRel][yRel].structure = map[xx][yy].structure.type;
                        view[xRel][yRel].level = map[xx][yy].structure.level;
                        if(map[xx][yy].player) view[xRel][yRel].player = true;
                        if(map[xx][yy].item) view[xRel][yRel].item = true;
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
            var dir = this.nextMove.dir;
            if(dir) {
                var target = this.cell.getNeighbor(dir);
                if(target) {
                    if(action == 'move') {
                        if(this.cell.sendPlayer(target)) {
                            if(this.cell.item) this.grabItem();
                        }
                    } else if(action == 'use') {
                        var inv = this.inventory[this.nextMove.inv];
                        if(inv) inv.use(target);
                    } else if(action == 'toss') {
                        this.tossItem(this.nextMove.inv, dir);
                    }
                }
            }
            this.nextMove = null;
        }
    };

    this.grabItem = function() {
        this.inventory[this.inventory.length] = this.cell.giveItem();
    };

    this.tossItem = function(itemIndex, dir) {
        var target = this.cell.getNeighbor(dir);

        if(target.receiveItem(this.inventory[itemIndex])) {
            this.inventory.splice(itemIndex, 1);
        }
    };

    this.invAdd = function(item) {
        this.inventory[this.inventory.length] = item;
    };
}
