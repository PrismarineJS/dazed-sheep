'use strict';

module.exports.player = function(player){
  player.spawn=() => {
    player._client.write('spawn_player', {
      player_id: -1,
      player_name: "UserXYZ",
      x: 1 * 32,
      y: 32 * 32,
      z: 1 * 32,
      yaw: 0,
      pitch: 0
    });

    player._client.write('message', {
      player_id: -1,
      message: 'UserXYZ joined the game'
    });
  };
};