const request = require('request');

module.exports.server = function(serv, settings) {
  if(settings.public == true) {
    setInterval(function beat() {
      serv.heartbeat();
    }, 45000);
  }

  serv.heartbeat = function() {
    request('https://www.classicube.net/heartbeat.jsp?port=' +
    settings.port +
    '&max=' + settings['max-players'] +
    '&name=' + settings['name'] +
    '&public=' + settings['public'].toString().capitalize() +
    '&version=7&salt=' + serv.salt +
    '&users=' + serv['online_players'], function (error, response, body) {
      // console.log('https://www.classicube.net/heartbeat.jsp?port=' +
      // settings.port +
      // '&max=' + settings['max-players'] +
      // '&name=' + settings['name'] +
      // '&public=' + settings['public'].toString().capitalize() +
      // '&version=7&salt=' + serv.salt +
      // '&users=' + serv['online_players']);
      // console.log(body);
    });
  };
};

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
