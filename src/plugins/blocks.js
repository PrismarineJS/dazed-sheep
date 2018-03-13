const Vec3 = require('vec3');

module.exports.player = function(player, serv, settings) {
  player._client.on('set_block', function(packet) {
    if(packet.mode == 0x01) {
      serv.setBlock(new Vec3(packet.x, packet.y, packet.z), packet.block_type);
    } else if(packet.mode == 0x00) {
      serv.destroyBlock(new Vec3(packet.x, packet.y, packet.z));
    }
  });
};

module.exports.server = function(serv) {
  serv.setBlock = function(coords, blockType) {
    serv.world.setBlock(new Vec3(coords.x, coords.y, coords.z), blockType);

    serv._writeAll('set_block', {
      x: coords.x,
      y: coords.y,
      z: coords.z,
      block_type: blockType
    });
  };

  serv.destroyBlock = function(coords) {
    serv.world.setBlock(new Vec3(coords.x, coords.y, coords.z), 0);

    serv._writeAll('set_block', {
      x: coords.x,
      y: coords.y,
      z: coords.z,
      block_type: 0
    });
  };
};
