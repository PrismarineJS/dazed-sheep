const mc = require('minecraft-classic-protocol');
const cpe = require('minecraft-classic-protocol-extension');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const requireIndex = require('requireindex');

function createMCServer(options) {
  options = options || {};
  const mcServer = new MCServer();
  options.customPackets = cpe.protocol;
  mcServer.connect(options);
  return mcServer;
}

class MCServer extends EventEmitter {
  constructor() {
    super();
    this._server = null;
  }

  connect(options) {
    const plugins = requireIndex(path.join(__dirname, 'src', 'plugins'));
    this._server = mc.createServer(options);

    Object.keys(plugins)
      .filter(pluginName => plugins[pluginName].server != undefined)
      .forEach(pluginName => plugins[pluginName].server(this, options));

    this._server.on('error', error => this.emit('error', error));
    this._server.on('clientError', error => this.emit('error', error));
    this._server.on('listening', () => this.emit('listening', this._server.socketServer.address().port));
    this.emit('asap');
  }
}

module.exports = {
  createMCServer: createMCServer
};
