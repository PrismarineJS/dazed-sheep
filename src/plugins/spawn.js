const Vec3 = require('vec3');

module.exports.player = function(player, serv, settings){
  player.spawn = function() {
    player.pos = new Vec3(1 * 32, 34 * 32, 1 * 32);
    player.yaw = 0;
    player.pitch = 0;
    player.op = true;
    player.cpe = false;
    player.supported_extensions = [];

    if(player._client.identification_byte == 0x42) {
      player.cpe = true;
    }

    if(player.cpe) {
      player._client.write('ext_info', {
        app_name: 'dazed-sheep',
        extension_count: 0
      });
    }

    player._client.write('spawn_player', {
      player_id: -1,
      player_name: player._client.username,
      x: player.pos.x,
      y: player.pos.y,
      z: player.pos.z,
      yaw: player.yaw,
      pitch: player.pitch
    });

    serv.players.forEach(function(_player) {
      _player._client.write('spawn_player', {
        player_id: serv.entityID,
        player_name: player._client.username,
        x: player.pos.x,
        y: player.pos.y,
        z: player.pos.z,
        yaw: player.yaw,
        pitch: player.pitch
      });
    });

    serv.players.push(player);

    serv.players.forEach(function(_player) {
      if(_player.id != player.id) {
        player._client.write('spawn_player', {
          player_id: _player.id,
          player_name: _player.username,
          x: _player.pos.x,
          y: _player.pos.y,
          z: _player.pos.z,
          yaw: _player.yaw,
          pitch: _player.pitch
        });
      }
    });

    serv.broadcast(serv.color.yellow + player._client.username + ' joined the game');
    serv.log.info(player.username + ' joined the game');

    serv.entityID++;
    serv['online_players']++;
  };
};
