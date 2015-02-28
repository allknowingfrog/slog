module.exports = function(build) {
    this.id = 'shovel';
    this.build = build;

    this.use = function(cell) {
        if(this.build) cell.raiseTerrain();
        else cell.lowerTerrain();
    };
}
