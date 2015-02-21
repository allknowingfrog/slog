module.exports = function(terrain) {
    this.terrain = terrain;

    this.use = function(cell) {
        cell.makeTerrain(this.terrain);
    };
}
