module.exports.player = function(player, serv, settings) {
  player._client.on('message', function(packet) {
    player._client.write('message', {
      player_id: -1,
      message: packet.message
    });
  });
}