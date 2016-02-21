"use strict";

var mc = require('minecraft-classic-protocol');
var zlib = require('zlib');

var options = { port: 25565 };
var server = mc.createServer(options);
var players = 0;
var World = require("./world");
var Vec3=require("vec3").Vec3;

server.on('login', function(client) {
  players++;
  console.log("someone connected!");
  var addr = client.socket.remoteAddress + ':' + client.socket.remotePort;

  client.on('end', function() {
    console.log("someone left!");
    players--;
  });

  client.write('level_initialize', {});

  var map=new World({x:256,y:64,z:256});

  for(let x=0;x<256;x++)
    for(let z=0;z<256;z++)
      for(let y=0;y<64;y++)
      map.setBlock(new Vec3(x,y,z),3);

  var compressedMap=zlib.gzipSync(map.dump());

  for(var i=0;i<compressedMap.length;i+=1024) {
    client.write('level_data_chunk', {
      chunk_data: compressedMap.slice(i, Math.min(i + 1024, compressedMap.length)),
      percent_complete: i==0 ? 0 : Math.ceil(i/compressedMap.length * 100)
    });
  }

  client.write('level_finalize', {
    x_size: 256,
    y_size: 64,
    z_size: 256
  });

  client.write('spawn_player', {
    player_id: -1,
    player_name: "UserXYZ",
    x: 2,
    y: 64 * 32,
    z: 2,
    yaw: 0,
    pitch: 0
  });


  client.write('message', {
    player_id: -1,
    message: 'UserXYZ joined the game'
  });

  client.on('message', function(unused, message) {
    client.write('message', {
      player_id: -1,
      message: unused.message
    });
  });

});

server.on('error', function(error) {
  console.log('Oops! Something went wrong, ', error);
});

server.on('listening', function() {
  console.log('Server running on port', server.socketServer.address().port + "!");
});