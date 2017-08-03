var fs = require('fs');
var zlib = require('zlib');
var World = require('../world');
var Vec3 = require('vec3');

module.exports.server = function(serv) {
  serv.world = new World({x: 256, y: 64, z: 256}, 'world', serv.db);

  serv.world.load(function(err) {
    if(err) {
      var count = 0;
      for (var x = 0; x < serv.world.size.x; x++) {
        for (var y = 0; y <= (serv.world.size.y / 2); y++) {
          for (var z = 0; z < serv.world.size.z; z++) {
            if (y == 0) {
              serv.world.setBlock(new Vec3(x, y, z), 0x07); 
            } else if (y <= (serv.world.size.y / 2) - 4) {
              serv.world.setBlock(new Vec3(x, y, z), 0x01);
            } else if (y <= (serv.world.size.y / 2) - 1) {
              serv.world.setBlock(new Vec3(x, y, z), 0x03);
            } else if (y == (serv.world.size.y / 2)) {
              serv.world.setBlock(new Vec3(x, y, z), 0x02);
            }

            count++;
          }
        }
      }

      serv.world.save(function(err) {
        if (err) throw err;
        serv.world.load(function(err) {
          if(err) throw err;
        });
      });
    }
  });

  // if(fs.existsSync(__dirname + '/../../world/level.dat') != true) {
  //   copyWorld(function() {
  //     readWorld(function(err, data) {
  //       if(err) {
  //         throw err;
  //       } else {
  //         serv.world.load(data);
  //       }
  //     });
  //   });
  // } else {
  //   readWorld(function(err, data) {
  //     if(err) {
  //       throw err;
  //     } else {
  //       serv.world.load(data);
  //     }
  //   });
  // }
};

// function copyWorld(cb) {
//   fs.createReadStream(__dirname + '/../../world/default-level.dat')
//     .pipe(fs.createWriteStream(__dirname + '/../../world/level.dat'))
//     .on('finish', function() {
//       cb()
//   });
// }
//
// function readWorld(cb) {
//   fs.readFile(__dirname + '/../../world/level.dat', function(err, data) {
//     if(err) {
//       cb(err, null);
//     } else {
//       zlib.gunzip(data, function(err, data) {
//         if(err) {
//           cb(err, null)
//         } else {
//           cb(err, data);
//         }
//       });
//     }
//   });
// }
