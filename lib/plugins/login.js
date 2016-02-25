'use strict';

const EventEmitter = require('events').EventEmitter;
const path = require('path');
const requireIndex = require('requireindex');
const plugins = requireIndex(path.join(__dirname));

var zlib = require('zlib');

var World = require("../world");

module.exports.server = function(serv, options) {
  serv.on('error', function(error) {
    console.log('Oops! Something went wrong, ', error);
  });

  serv.on('listening', function() {
    console.log('Server running on port', serv._server.socketServer.address().port + "!");
  });

  serv._server.on('login', (client) => {
    if(client.socket.listeners('end').length == 0) return;
    const player = new EventEmitter();
    player._client = client;

    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].player != undefined)
      .forEach(pluginName => plugins[pluginName].player(player, serv, options));

    serv.emit("newPlayer", player);
    player.emit('asap');
    player.login();
  });
};

module.exports.player = function(player, serv, settings) {
  player.login = () => {
    var addr = player._client.socket.remoteAddress + ':' + player._client.socket.remotePort;

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
        message: '&e' + player.name + ' left the game'
      });
      console.log(player.name + ' left the game');
    });

    player._client.on('error', function(err) { 
      console.log(err.stack);
    });

    player._client.write('level_initialize', {});

    // for(let x=0;x<256;x++)
    //   for(let z=0;z<256;z++)
    //     for(let y=0;y<128;y++)
    //     map.setBlock(new Vec3(x,y,z),3);

    var compressedMap=zlib.gzipSync(serv.world.dump());

    for(var i = 0; i < compressedMap.length; i += 1024) {
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

    player.spawn();
  };
};
