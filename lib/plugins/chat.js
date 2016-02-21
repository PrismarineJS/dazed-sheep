module.exports.player = function(player, serv, settings) {
  player._client.on('message', function(packet) {
    serv._writeAll('message', {
      player_id: player.id,
      message: '<' + player.name + '> ' + packet.message
    });
  });
}