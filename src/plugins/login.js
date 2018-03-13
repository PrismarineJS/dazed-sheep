const EventEmitter = require('events').EventEmitter;
const path = require('path');
const requireIndex = require('requireindex');
const plugins = requireIndex(path.join(__dirname));
const version = require('../../package.json').version;
const Logger = require('js-logger');
const crypto = require('crypto');
const MD5 = require('md5.js')
const zlib = require('zlib');

const World = require('../world');
const Command = require('../command');

module.exports.server = function(serv, options) {
  serv.pid = process.pid;
  serv.log = Logger;
  serv.log.useDefaults();

  if(process.env.NODE_ENV == 'test') {
    serv.log.setLevel(serv.log.OFF);
  }

  serv._server.on('connection', client =>
    client.on('error', error => serv.emit('clientError', client, error)));

  serv.log.info('Starting dazed-sheep server version 0.30c (' + version + ')');

  serv.salt = crypto.randomBytes(16).toString('hex');
  serv['online_players'] = 0;

  process.on('SIGINT', function() {
    setTimeout(function() {
      process.exit(0);
    }, 500);
  });

  serv.on('error', function(error) {
    serv.log.error('Oops! Something went wrong, ' + error);
  });

  serv.on('listening', function() {
    serv.log.info('Starting dazed-sheep server on *:' + serv._server.socketServer.address().port);
  });

  serv._server.on('login', (client) => {
    if(client.socket.listeners('end').length == 0) return;
    const player = new EventEmitter();
    player._client = client;
    player.commands = new Command({});

    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].player != undefined)
      .forEach(pluginName => plugins[pluginName].player(player, serv, options));

    serv.emit('newPlayer', player);
    player.emit('asap');
    player.login();
  });

  serv.heartbeat();
};

module.exports.player = function(player, serv, settings) {
  player.login = () => {
    player._client.on('error', function(err) {
      serv.log.info(err.stack);
    });

    let addr = player._client.socket.remoteAddress + ':' + player._client.socket.remotePort;

    player.verification_key = player._client.verification_key;
    player.id = serv.entityID;
    player.username = player._client.username;

    serv.log.info(player.username + '[/' + player._client.socket.remoteAddress + ':' + player._client.socket.remotePort + '] logged in with entity id ' + player.id);

    player.emit('connected');

    player._client.on('end', function() {
      serv.players.forEach(function(_player) {
        if(_player.id != player.id) {
          _player._client.write('despawn_player', {
            player_id: player.id,
          });
        }
      });
      const index = serv.players.indexOf(player);
      if (index > -1) {
        serv.players.splice(index, 1);
      }
      serv._writeAll('message', {
        player_id: player.id,
        message: '&e' + player.username + ' left the game'
      });
      serv.log.info(player.username + ' left the game');
      serv['online_players']--;
      player.emit('disconnected');
    });

    player._client.write('level_initialize', {});

    let compressedMap = zlib.gzipSync(serv.world.dump());

    for(let i = 0; i < compressedMap.length; i += 1024) {
      player._client.write('level_data_chunk', {
        chunk_data: compressedMap.slice(i, Math.min(i + 1024, compressedMap.length)),
        percent_complete: i == 0 ? 0 : Math.ceil(i / compressedMap.length * 100)
      });
    }

    player._client.write('level_finalize', {
      x_size: 256,
      y_size: 64,
      z_size: 256
    });

    if(settings['max-players'] < serv['online_players'] + 1) {
      player._client.write('disconnect_player', {
        disconnect_reason: 'The player limit has been reached, please try again later'
      });
    } else {
      if(settings['online-mode'] == true) {
        if((new MD5().update(serv.salt + player._client.username).digest('hex')) == player.verification_key) {
          player.spawn();
        } else {
          player._client.write('disconnect_player', {
            disconnect_reason: 'Your username could not be verified!'
          });
          serv.log.info(player.username + ' couldn\'t be verified!');
        }
      } else {
        player.spawn();
      }
    }
  };
};
