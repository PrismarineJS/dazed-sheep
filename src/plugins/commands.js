var version = require('../../package').version;

module.exports.player = function(player, serv) {

  player.commands.add({
    base: 'help',
    info: 'to show all commands',
    usage: '/help [page:command name]',
    parse: function parse(str) {
      var params = str.split(' ');
      var page = parseInt(params[params.length - 1]);
      if (page) {
        params.pop();
      }
      var search = params.join(' ');
      return {
        search: search,
        page: page && page - 1 || 0
      };
    },
    action: function action(_ref) {
      var search = _ref.search;
      var page = _ref.page;

      if (page < 0) return 'Page # must be >= 1';
      var hash = player.commands.uniqueHash;

      var PAGE_LENGTH = 7;

      var found = Object.keys(hash).filter(function (h) {
        return (h + ' ').indexOf(search && search + ' ' || '') == 0;
      });

      if (found.length == 0) {
        // None found
        return serv.color.red + 'Could not find any matches';
      } else if (found.length == 1) {
        // Single command found, giev info on command
        var cmd = hash[found[0]];
        var usage = cmd.params && cmd.params.usage || cmd.base;
        var info = cmd.params && cmd.params.info || 'No info';
        player.chat(usage + ': ' + info);
      } else {
        // Multiple commands found, give list with pages
        var totalPages = Math.ceil((found.length - 1) / PAGE_LENGTH);
        if (page >= totalPages) return serv.color.red + 'The number you have entered is too big, it must be at most ' + totalPages;
        found = found.sort();
        if (found.indexOf('search') != -1) {
          var baseCmd = hash[search];
          player.chat(baseCmd.base + ' -' + (baseCmd.params && baseCmd.params.info && ' ' + baseCmd.params.info || ''));
        } else {
          player.chat(serv.color.green + '--- Showing help page ' + (page + 1) + ' of ' + totalPages + ' (/help <page>) ---');
        }
        for (var i = PAGE_LENGTH * page; i < Math.min(PAGE_LENGTH * (page + 1), found.length); i++) {
          if (found[i] === search) continue;
          var cmd = hash[found[i]];
          var usage = cmd.params && cmd.params.usage || cmd.base;
          var info = cmd.params && cmd.params.info || 'No info';
          player.chat(usage + ': ' + info);
        }
      }
    }
  });

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
    usage: '/op <username>',
    op: true,
    action(username) {
      const user = serv.getPlayer(username.toString().split(' ')[0].trim());

      if (!user)
        return serv.color.red + 'Player not found';

      if(user.op != true) {
        user.op = true;
      }

      user._client.write('update_user_type', {
        user_type: 0x64
      });

      if(user != player) {
        user.chat(serv.color.gray + 'You have been granted operator permissions');
      }

      player.chat('Opped ' + username);
    }
  });

  player.commands.add({
    base: 'deop',
    info: 'remove a player\'s operator permissions',
    usage: '/deop <username>',
    op: true,
    action(username) {
      const user = serv.getPlayer(username.toString().split(' ')[0].trim());

      if (!user)
        return serv.color.red + 'Player not found';

      if(user.op != false) {
        user.op = false;
      }

      user._client.write('update_user_type', {
        user_type: 0x00
      });

      if(user != player) {
        user.chat(serv.color.gray + 'Your operator permissions have been revoked');
      }

      player.chat('De-opped ' + username);
    }
  });

  player.commands.add({
    base: 'save',
    info: 'save the world',
    usage: '/save',
    op: true,
    action() {
      player.chat('Saving...')
      serv.world.save(function(err) {
        if(!err) {
          player.chat('Saved the world');
        } else {
          return err;
        }
      });
    }
  });

  player.commands.add({
    base: 'tp',
    info: 'teleport a player to another player',
    usage: '/tp <player>',
   op: true,
    action(username) {
      const user = serv.getPlayer(username.toString().split(' ')[0].trim());

      if (!user) {
        return serv.color.red + 'Player not found';
      } else {
        player.setPosition(user.pos.x, user.pos.y, user.pos.z, user.yaw, user.pitch);
      }
    }
  });

  player.commands.add({
    base: 'kick',
    info: 'kick a player from the server',
    usage: '/kick <player> [reason]',
   op: true,
    action(params) {
      const user = serv.getPlayer(params.toString().split(' ')[0].trim());
      if(params.toString().split(' ')[1] != null) {
        const reason = params.toString().split(' ')[1].trim();
      }

      if (!user) {
        return serv.color.red + 'Player not found';
      } else {
        if(reason == undefined) {
          player.disconnect('You have been kicked from the server');
        } else {
          player.disconnect(reason);
        }
      }
    }
  });

  player.commands.add({
    base: 'cpe',//
    info: 'checks if a player has cpe support',
    usage: '/cpe',
    action(params) {
      if(player.cpe == true) {
        return serv.color.green + 'Awesome! You support cpe!';
      } else {
        return serv.color.red + 'Aw darn, you don\'t support cpe!';
      }
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
