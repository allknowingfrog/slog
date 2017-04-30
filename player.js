module.exports = function(id, nickname) {
    this.nickname = nickname;
    this.cell = null;
    this.nextMove = null;

    this.view = function() {
        var cells = this.cell.view();
        var output = [];
        for(var c in cells) {
            output.push(cells[c].encode());
        }
        return output;
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
}
