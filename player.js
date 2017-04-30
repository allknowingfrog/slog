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
        return {
            me: this.cell.address(),
            view: output
        };
    };

    this.move = function() {
        if(this.nextMove) this.cell.sendPlayer(this.nextMove.x, this.nextMove.y);
        this.nextMove = null;
    };
}
