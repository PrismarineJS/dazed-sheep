'use strict';
var Vec3 = require('vec3');

module.exports.player = function(player, serv){
  player.spawn = () => {
    player.pos = new Vec3(1 * 32, 32 * 32, 1 * 32);
    player.yaw = 0;
    player.pitch = 0;
    player.op = false;
    player.cpe = false;

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
      })
    }); 

    player.id = serv.entityID;
    player.name = player._client.username;

    serv.players.push(player);
    serv.players.forEach(function(_player) {
      if(_player.id != player.id) {
        player._client.write('spawn_player', {
          player_id: _player.id,
          player_name: _player.name,
          x: _player.pos.x,
          y: _player.pos.y,
          z: _player.pos.z,
          yaw: _player.yaw,
          pitch: _player.pitch
        });
      }
    });

    serv._writeAll('message', {
      player_id: player.id,
      message: serv.color.yellow + player._client.username + ' joined the game'
    });

    console.log(player.name + '[/' + player._client.socket.remoteAddress + ':' + player._client.socket.remotePort + '] logged in with entity id ' + player.id);
    console.log(player.name + ' joined the game');

    if(player._client.identification_byte == 0x42) {
      player.cpe = true;
    }

    serv.entityID++;
  };
};