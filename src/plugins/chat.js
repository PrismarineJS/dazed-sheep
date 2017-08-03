module.exports.player = function(player, serv, settings) {
  player._client.on('message', function(packet) {
    if(packet.message.split('')[0] == '/') {
      player.handleCommand(packet.message);
    } else {
      player.emit('chat', {message: packet.message});
      serv.broadcast('<' + player.username + '> ' + packet.message);
      serv.log.info('<' + player.username + '> ' + packet.message);
    }
  });

  player.chat = function(message) {
    player._client.write('message', {
      player_id: player.id,
      message: message
    });
  };
};

module.exports.server = function(serv) {
  serv.broadcast = function(message) {
    serv._writeAll('message', {
      player_id: 0,
      message: message
    });
  };

  serv.color = {
    'black': '&0',
    'dark_blue': '&1',
    'navy': '&1',
    'dark_green': '&2',
    'green': '&2',
    'teal': '&3',
    'dark_red': '&4',
    'maroon': '&4',
    'purple': '&5',
    'dark_yellow': '&6',
    'gold': '&6',
    'gray': '&7',
    'grey': '&7',
    'silver': '&7',
    'dark_gray': '&8',
    'dark_grey': '&8',
    'indigo': '&9',
    'blue': '&9',
    'bright_green': '&a',
    'lime': '&a',
    'cyan': '&b',
    'aqua': '&b',
    'red': '&c',
    'pink': '&d',
    'yellow': '&e',
    'white': '&f'
  };
};
