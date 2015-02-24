module.exports = function(cell, level) {
    this.type = 'soil';
    this.cell = cell;
    this.passable = true;
    this.level = level;
    if(!this.level && this.level != 0) this.level = 1;

    this.grow = function() {
        if(this.level <= 2) {
            this.level++;
            if(this.level == 2) {
                this.passable = false;
            }
        }
        this.checkOutside();
    };

    this.shrink = function() {
        if(this.level >= 0) {
            this.level--;
            if(this.level != 2) {
                this.passable = true;
            }
        }
        this.checkOutside();
    };

    this.checkOutside = function() {
        if(this.level) this.cell.outside = false;
        else this.cell.outside = true;
    };

    this.checkOutside();
};
