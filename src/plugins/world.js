var fs = require('fs');
var zlib = require('zlib');
var World = require('../world');
var Vec3 = require('vec3');

module.exports.server = async function(serv) {
  serv.world = new World({x: 256, y: 64, z: 256});

  serv.world.load()
    .then(() => { })
    .catch(async () => {
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
          }
        }
      }

      await serv.world.save();
    });
}
