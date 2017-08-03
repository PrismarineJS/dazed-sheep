module.exports.server = function(serv) {
  serv.players = [];
  serv.entityID = 0;

  serv.getPlayer = function(name) {
    let found = serv.players.filter(function (pl) {
      return pl.name == name;
    });
    if (found.length > 0)
      return found[0];

    return null;
  };
};
