var fs = require('fs');
var mca = require('minecraft-classic-anvil');
var World = require('../world')

module.exports.server = function(serv) {
  serv.world = new World({x:256,y:64,z:256});
  serv.world.load(mca.readSync(fs.readFileSync(__dirname + '/../../world/level.dat')).blocks.$);
};