'use strict';

module.exports.player = function(player, serv){
  player.spawn = () => {
    player._client.write('spawn_player', {
      player_id: serv.entityID,
      player_name: player._client.username,
      x: 1 * 32,
      y: 32 * 32,
      z: 1 * 32,
      yaw: 0,
      pitch: 0
    });

    player.id = serv.entityID;
    player.name = player._client.username;

    serv.players.push(player);

    serv._writeAll('message', {
      player_id: player.id,
      message: player._client.username + ' joined the game'
    });

    serv.entityID++;
  };
};