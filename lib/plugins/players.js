module.exports.server = function(serv) {
  serv.players = [];
  serv.entityID = 0;

  serv.getPlayer = function(username) {
    var found = serv.players.filter(function (pl) {
      return pl.username == username;
    });
    if (found.length > 0)
      return found[0];

    return null;
  };
}
