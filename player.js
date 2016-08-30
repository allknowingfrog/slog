module.exports = function(nickname, cell) {
    this.nickname = nickname;
    this.cell = cell;
    this.cell.player = this;
    this.initiative = 0;
    this.bearing = null;

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
                if(Math.abs(xRel-yRel) <= MAX_VIEW && this.cell.validCoords(xx, yy)) {
                    view[xRel][yRel].structure = map[xx][yy].structure;
                    if(map[xx][yy].player) view[xRel][yRel].player = true;
                } else {
                    view[xRel][yRel] = null;
                }
            }
        }

        return view;
    };

    this.move = function() {
        if(!this.bearing) return false;

        var target = this.cell.neighbor(this.bearing);
        this.bearing = null;
        if(target && target.passable()) {
            this.cell.player = null;
            this.cell = target;
            target.player = this;
            return true;
        }

        return false;
    };
}
