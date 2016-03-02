var version = require('../../package').version;

module.exports.player = function(player, serv) {

  player.commands.add({
    base: 'version',
    info: 'get the version of the server',
    usage: '/version',
    action() {
      return 'This server is running dazed-sheep (' + version + ')';
    }
  });

  player.handleCommand = function(str) {
    try {
      const res = player.commands.use(str, player.op);
      if (res) 
        player.chat(res);
    }
    catch(err) {
      if (err) 
        player.chat(serv.color.red + 'Error: ' + err.message);

      else setTimeout(function() {
        throw err;
      }, 0);
    }
  }
};