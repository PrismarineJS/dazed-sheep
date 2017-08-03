module.exports.player = function(player, serv) {
  player._client.on('position', function(packet) {
    player.positionUpdate(packet.x, packet.y, packet.z);
    player.orientationUpdate(packet.yaw, packet.pitch);
  });

  player.positionUpdate = function(x, y, z) {
    serv.players.forEach(function(_player) {
      if(_player.id != player.id) {
        _player._client.write('position_update', {
          player_id: player.id,
          change_in_x: x - player.pos.x,
          change_in_y: y - player.pos.y,
          change_in_z: z - player.pos.z,
        });
      }
    });

    player.pos.x = x;
    player.pos.y = y;
    player.pos.z = z;
  };

  player.orientationUpdate = function(yaw, pitch) {
    serv.players.forEach(function(_player) {
      if(_player.id != player.id) {
        _player._client.write('orientation_update', {
          player_id: player.id,
          yaw: yaw,
          pitch: pitch
        });
      }
    });

    player.yaw = yaw;
    player.pitch = pitch;
  };

  player.setPosition = function(x, y, z, yaw, pitch) {
    player._client.write('player_teleport', {
      player_id: -1,
      x: user.pos.x,
      y: user.pos.y,
      z: user.pos.z,
      yaw: user.yaw,
      pitch: user.pitch
    });

    player.pos.x = x;
    player.pos.y = y;
    player.pos.z = z;
    player.yaw = yaw;
    player.pitch = pitch;
  };
};
