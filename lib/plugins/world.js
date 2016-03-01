var fs = require('fs');
var mca = require('minecraft-classic-anvil');
var World = require('../world')

module.exports.server = function(serv) {
  serv.world = new World({x:256,y:64,z:256});
  if(fs.existsSync(__dirname + '/../../world/level.dat') != true) {
    // level.dat doesn't exist but default-level.dat does so copy it to level.dat
    fs.createReadStream(__dirname + '/../../world/default-level.dat').pipe(fs.createWriteStream(__dirname + '/../../world/level.dat')).on('finish', function() {
      serv.world.load(mca.readSync(fs.readFileSync(__dirname + '/../../world/level.dat')).$.blocks.$);
    });
  } else {
    // level.dat exists (probably) so read it
    serv.world.load(mca.readSync(fs.readFileSync(__dirname + '/../../world/level.dat')).$.blocks.$); 
  }
};