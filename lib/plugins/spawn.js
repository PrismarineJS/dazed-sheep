'use strict';

module.exports.player = function(player, serv){
  player.spawn = () => {
    console.log(serv.entityID)
    player._client.write('spawn_player', {
      player_id: serv.entityID,
      player_name: "player" + serv.entityID,
      x: 1 * 32,
      y: 32 * 32,
      z: 1 * 32,
      yaw: 0,
      pitch: 0
    });

    serv.players.push({
      player_id: serv.entityID,
      player_name: "player" + serv.entityID
    });

    player._client.write('message', {
      player_id: serv.entityID,
      message: 'player' + serv.entityID + ' joined the game'
    });

    serv.entityID++;
  };
};