module.exports = function(terrain) {
    this.id = 'shovel';
    this.terrain = terrain;

    this.use = function(cell) {
        cell.makeTerrain(this.terrain);
    };
}
