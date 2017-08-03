module.exports.server = function(serv) {
  serv._writeAll = (packetName, packetFields) =>
    serv.players.forEach((player) => player._client.write(packetName, packetFields));
};