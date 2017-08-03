module.exports.player = function(player) {
  player.disconnect = function(reason) {
    player._client.write('disconnect_player', {
      disconnect_reason: reason
    });
  };
};
