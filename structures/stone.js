module.exports = function(cell) {
    this.type = 'stone';
    this.cell = cell;
    this.passable = false;

    this.cell.outside = false;
};
