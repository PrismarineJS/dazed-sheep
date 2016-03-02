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

  player.commands.add({
    base: 'op',
    info: 'give a player operator permissions',
    usage: '/op username',
    action(username) {
      const user = serv.getPlayer(username.toString().split(' ')[0].trim());
      
      if (!user) 
        return serv.color.red + 'Player not found';

      if(user.op != true) {
        user.op = true;
      } else {
        return serv.color.red + user.name + ' is already opped'
      }
      user._client.write('update_user_type', {
        user_type: 0x64
      })
      player.chat(username + ' has been opped');
    }
  });

  player.commands.add({
    base: 'deop',
    info: 'remove a player\'s operator permissions',
    usage: '/deop username',
    action(username) {
      const user = serv.getPlayer(username.toString().split(' ')[0].trim());
      
      if (!user) 
        return serv.color.red + 'Player not found';

      if(user.op != false) {
        user.op = false;
      } else {
        return serv.color.red + user.name + ' isn\'t opped';
      }

      user._client.write('update_user_type', {
        user_type: 0x00
      })
      player.chat(username + ' has been deopped');
    }
  });

  // player.commands.add({
  //   base: '',
  //   info: '',
  //   usage: '',
  //   action() {
  //     return '';
  //   }
  // });

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