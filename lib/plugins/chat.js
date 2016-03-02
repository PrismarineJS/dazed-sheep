module.exports.player = function(player, serv, settings) {
  player._client.on('message', function(packet) {
    if(packet.message.split('')[0] == "/") {
      // it's a command
      player.handleCommand(packet.message);
    } else {
      // it's a message, send it to all players
      serv._writeAll('message', {
        player_id: player.id,
        message: '<' + player.name + '> ' + packet.message
      });
    }
  });

  player.chat = function(message) {
    player._client.write('message', { 
      player_id: player.id,
      message: message
    });
  };
}