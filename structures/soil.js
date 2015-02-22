module.exports = function(cell) {
    this.type = 'soil';
    this.cell = cell;
    this.passable = true;
    this.level = 1;

    this.grow = function() {
        if(this.level <= 2) {
            this.level++;
            if(this.level == 2) {
                this.passable = false;
            }
        }
    };

    this.shrink = function() {
        if(this.level >= 0) {
            this.level--;
            if(this.level != 2) {
                this.passable = true;
            }
        }
    };

    this.cell.outside = true;
};
