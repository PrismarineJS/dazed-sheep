var levelup = require('levelup');

module.exports.server = function(serv) {
  serv.put = function(key, value, cb) {
    serv.db.put('~' + key.toString(), value, function(err) {
      cb(err);
    });
  };

  serv.get = function(key, cb) {
    serv.db.get('~' + key.toString(), function(err, value) {
      cb(err, value);
    });
  };
};
