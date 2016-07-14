var fs = require('fs');
var zlib = require('zlib');
var World = require('../world');
var Vec3 = require('vec3');

module.exports.server = function(serv) {
  serv.world = new World({x: 256, y: 64, z: 256}, "world", serv.db);

  serv.world.load(function(err) {
    if(err) {
      for (var x = 0; x < 256; x++) {
        for (var z = 0; z < 256; z++) {
          serv.world.setBlock(new Vec3(x, 31, z), 0x02); 
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
