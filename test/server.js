'use strict';

const net = require('net');
const mc = require('minecraft-classic-protocol');

describe("server", function() {
  let serv;
  let client;
  let loaded = false;
  let spawned = false;

  before(function(done) {
    serv = require("../index").createMCServer({
      port: 25565,
      name: "A Minecraft Server",
      motd: "Welcome to my Minecraft Server!"
    });

    client = mc.createClient({
      host: 'localhost',
      port: 25565,
      username: 'echo',
      password: 'ping'
    });

    serv.on("listening", function() {
      done(null);
    });
  });

  after(function(done){
    serv._server.close();
    serv._server.on("close", function() {
      client.end();
      done();
    });
  });

  it("is running", function(done) {
    const client = net.Socket();
    client.connect(serv._server.socketServer.address().port, '127.0.0.1', done);
    client.on('error', done);
  });

  it("can log in", function(done) {
    client.on('connect', function() {
      done();
    });

    client.on('spawn_player', function() {
      spawned = true;
    });

    client.on('level_finalize', function() {
      loaded = true;
    });

    client.on('error', function(err) {
      throw err;
    });
  });

  it("spawned", function(done) {
    if(spawned == true) {
      done(); // this is pretty hacky
    }
  });

  it("does get world", function(done) {
    if(loaded == true) {
      done(); // this is pretty hacky
    }
  });

  it("can chat", function(done) {
    client.write('message', {
      message: 'hi'
    });

    client.on('message', function(packet) {
      if(packet.message == '<echo> hi') {
        done();
      }
    });
  });
});