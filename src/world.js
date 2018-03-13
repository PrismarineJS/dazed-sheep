const fs = require('fs');
const zlib = require('zlib');
const { promisify } = require('util');

const [
  readFileAsync,
  writeFileAsync,
  gunzipAsync,
  gzipAsync
] = [
  promisify(fs.readFile),
  promisify(fs.writeFile),
  promisify(zlib.gunzip),
  promisify(zlib.gzip)
];

class World {
  constructor(size) {
    this.size = size;
    this.data = new Buffer(4 + size.x * size.y * size.z);
    this.data.fill(0);
    this.data.writeInt32BE(this.size.x * this.size.y * this.size.z, 0);
  }

  setBlock(pos, block) {
    this.data.writeUInt8(block, 4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y));
  }

  getBlock(pos, block) {
    return this.data.readUInt8(4 + pos.x + this.size.z * (pos.z + this.size.x * pos.y));
  }

  dump() {
    return this.data;
  }

  async load() {
    this.data = await gunzipAsync(await readFileAsync('level.dat'));
  }

  async save() {
    await writeFileAsync('level.dat', await gzipAsync(this.data));
  }
}

module.exports = World;
