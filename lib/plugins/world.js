var fs = require('fs');
var zlib = require('zlib');
var mca = require('minecraft-classic-anvil');

var World = require('../world');

module.exports.server = function(serv) {
  serv.world = new World({x: 256, y: 64, z: 256});
  
  if(fs.existsSync(__dirname + '/../../world/level.dat') != true) {
    // level.dat doesn't exist but default-level.dat (probably) does so copy it to level.dat
    fs.createReadStream(__dirname + '/../../world/default-level.dat')
      .pipe(fs.createWriteStream(__dirname + '/../../world/level.dat'))
      .on('finish', function() {
        fs.readFile(__dirname + '/../../world/level.dat', function(err, data) {
          if(err) throw err;
          zlib.gunzip(data, function(err, data) {
            if(err) throw err;
            serv.world.load(data);
          });
        });
    });
  } else {
    // level.dat exists (probably) so read it
    fs.readFile(__dirname + '/../../world/level.dat', function(err, data) {
      if(err) throw err;
      zlib.gunzip(data, function(err, data) {
        if(err) throw err;
        serv.world.load(data);
      });
    });
  }
};