const { createMCServer } = require('../');
const { createClient } = require('minecraft-classic-protocol');
const Vec3 = require('vec3');

const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

const CONFIG = {
  port: 25565,
  name: 'A Minecraft Server',
  motd: 'Welcome to my Minecraft Server!',
  'max-players': 20,
  public: false,
  'online-mode': false,
  'disable-op-command': false,
  ops: [
    'mhsjlw',
    'rom1504'
  ],
  plugins: {}
};

describe('Client', () => {
  let client;
  let server;

  beforeAll(() => {
    server = createMCServer(CONFIG);

    client = createClient({
      host: 'localhost',
      port: CONFIG.port,
      username: 'Player',
      password: ''
    });

    return new Promise((resolve, reject) => {
      client.on('spawn_player', () => resolve());
    });
  });

  afterAll(async () => {
    server._server.close();
    await unlinkAsync('level.dat');
  });

  it('can place blocks', () => {
    const contents = {
      x: 0,
      y: 0,
      z: 0,
      mode: 0x01,
      block_type: 0x01
    };

    client.write('set_block', contents);

    delete contents.mode; // Server doesn't send the mode

    client.on('set_block', (packet) => expect(packet).toEqual(contents));
  });

  it('can chat', () => {
    const message = 'Hello!';

    client.write('message', { message, unused: 0x00 });

    client.on('message', (packet) => expect(packet).toEqual({ message: `<${NAME}> ${message}`, player_id: -1 }))
  });

  it('can move', (done) => {
    const position = new Vec3(1, 2, 3);

    client.write('position', {
      x: position.x,
      y: position.y,
      z: position.z,
      yaw: 0,
      pitch: 0
    });

    done();
  });
});
