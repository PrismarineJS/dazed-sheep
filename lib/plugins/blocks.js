var Vec3 = require('vec3');

module.exports.player = function(player, serv, settings) {
  player._client.on('set_block', function(packet) {
    if(packet.mode == 0x01) {
      // created
      serv.world.setBlock(new Vec3(packet.x, packet.y, packet.z), packet.block_type)

      serv._writeAll('set_block', {
        x: packet.x,
        y: packet.y,
        z: packet.z,
        block_type: packet.block_type
      });
    } else if(packet.mode == 0x00) {
      // destroyed
      serv.world.setBlock(new Vec3(packet.x, packet.y, packet.z), 0)

      serv._writeAll('set_block', {
        x: packet.x,
        y: packet.y,
        z: packet.z,
        block_type: 0
      });
    }
  });
}