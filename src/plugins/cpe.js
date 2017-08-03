module.exports.player = function(player, serv) {
  player._client.on('ext_info', function(packet) {
    player.extension_count = packet.extension_count;
    player.app_name = packet.app_name;
  });

  player._client.on('ext_entry', function(packet) {
    player.supported_extensions.push(packet);
  });
};
