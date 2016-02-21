module.exports.player = function(player, serv) {
  player._client.on('position', function(packet) {
    serv.players.forEach(function(_player) {
      if(_player.id != player.id) {
        _player._client.write('position_update', {
          player_id: player.id,
          change_in_x: packet.x - player.pos.x,
          change_in_y: packet.y - player.pos.y,
          change_in_z: packet.z - player.pos.z,
        });
      }
    })
    player.pos.x = packet.x;
    player.pos.y = packet.y;
    player.pos.z = packet.z;
  });
};