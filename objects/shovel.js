module.exports = function(structure) {
    this.id = 'shovel';

    this.use = function(cell) {
        cell.makeStructure(structure);
    };
}
