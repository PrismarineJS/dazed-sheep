'use strict';

const EventEmitter = require('events').EventEmitter;
const path = require('path');
const requireIndex = require('requireindex');
const plugins = requireIndex(path.join(__dirname));

var zlib = require('zlib');
var mca = require('minecraft-classic-anvil');
var fs = require('fs');

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
    console.log("someone connected!");
    var addr = player._client.socket.remoteAddress + ':' + player._client.socket.remotePort;

    player._client.on('end', function() {
      console.log("someone left!");
      const index = serv.players.indexOf(player);
      if (index > -1) {
        serv.players.splice(index, 1);
      }
      serv.entityID--;
      serv._writeAll('message', {
        player_id: player.id,
        message: player.name + ' left the game'
      });
    });

    player._client.write('level_initialize', {});

    var map = new World({x:256,y:64,z:256});
    map.load(mca.readSync(fs.readFileSync(__dirname + '/../../world/level.dat')).blocks.$);

    // for(let x=0;x<256;x++)
    //   for(let z=0;z<256;z++)
    //     for(let y=0;y<128;y++)
    //     map.setBlock(new Vec3(x,y,z),3);

    var compressedMap=zlib.gzipSync(map.dump());

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