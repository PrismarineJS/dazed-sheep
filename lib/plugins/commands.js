module.exports.player = function(player, serv) {

  player.commands.add({
    base: 'version',
    info: 'get the version of the server',
    usage: '/version',
    action() {
      return 'This server is running dazed-sheep (1.0.0)';
    }
  });

  // player.handleCommand = function(str) {
  //   try {
  //     player.commands.use(str, player.op);
  //   }
  //   catch(err) {
  //     player.chat(serv.color.red + 'Error! ' + err.message);
  //   }
  // }

  player.handleCommand = function(str) {
    try {
      const res = player.commands.use(str, player.op);
      if (res) 
        player.chat('&c' + res);
    }
    catch(err) {
      if (err) 
        player.chat('&cError: ' + err.message);
      else setTimeout(function() {throw err;}, 0);
    }
  }
};