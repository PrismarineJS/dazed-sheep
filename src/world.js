var fs = require('fs');
var zlib = require('zlib');
var levelup = require('levelup');

class World {
  constructor(size, name, db) {
    this.size = size;
    this.name = name.toString();
    this.db = db;
    this.data = new Buffer(4 + size.x * size.y * size.z);
    this.data.fill(0);
    this.data.writeInt32BE(this.size.x * this.size.y * this.size.z, 0);
  }

  setBlock(pos, block) {
    this.data.writeUInt8(block, 4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y))
  }

  getBlock(pos, block) {
    return this.data.readUInt8(4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y))
  }

  dump() {
    return this.data;
  }

  load(cb) {
    var scope = this;
    this.db.get('$' + this.name, function(err, value) {
      if(err) 
        cb(err);

      if(value != null) {
        value = new Buffer(value);
        value.copy(scope.data);
        cb(null);
      } else {
        cb(new Error('World not found'));
      }
    });
  }

  save(cb) {
    this.db.put('$' + this.name, this.dump(), function(err) {
      if(err) {
        cb(err);
      } else {
        cb(null);
      }
    });
  }
}

module.exports = World;
