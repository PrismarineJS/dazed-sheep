var fs = require('fs');
var zlib = require('zlib');
var mca = require('minecraft-classic-anvil');

var World = require('../world');

module.exports.server = function(serv) {
  serv.world = new World({x: 256, y: 64, z: 256});

  if(fs.existsSync(__dirname + '/../../world/level.dat') != true) {
    copyWorld(function() {
      readWorld(function(err, data) {
        if(err) {
          throw err;
        } else {
          serv.world.load(data);
        }
      });
    });
  } else {
    readWorld(function(err, data) {
      if(err) {
        throw err;
      } else {
        serv.world.load(data);
      }
    });
  }
};

function copyWorld(cb) {
  fs.createReadStream(__dirname + '/../../world/default-level.dat')
    .pipe(fs.createWriteStream(__dirname + '/../../world/level.dat'))
    .on('finish', function() {
      cb()
  });
}

function readWorld(cb) {
  fs.readFile(__dirname + '/../../world/level.dat', function(err, data) {
    if(err) {
      cb(err, null);
    } else {
      zlib.gunzip(data, function(err, data) {
        if(err) {
          cb(err, null)
        } else {
          cb(err, data);
        }
      });
    }
  });
}
