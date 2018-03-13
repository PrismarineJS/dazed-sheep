const World = require('../src/world');
const Vec3 = require('vec3');

const fs = require('fs');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);

describe('World', () => {
  let world;

  beforeAll(() => {
    world = new World(new Vec3(16, 16, 16));
  })

  it('can set block', () => {
    const position = new Vec3(1, 2, 3);
    const block = 0x01;

    world.setBlock(position, block);
    expect(world.getBlock(position)).toBe(block);
  });

  it('places block in the correct position in the buffer', () => {
    const position = new Vec3(1, 2, 3);
    const block = 0x01;

    world.setBlock(position, block);

    expect(world.dump().readUInt8(4 + position.x + 16 * (position.z + 16 * position.y))).toBe(block);
  });

  it('can get non-existent block', () => {
    const position = new Vec3(0, 0, 0);

    expect(world.getBlock(position)).toBe(0x00);
  });

  it('cannot get out-of-range', () => {
    expect(() => world.getBlock(new Vec3(32, 32, 32))).toThrow(new RangeError('Index out of range'));
  });

  it('cannot set out-of-range', () => {
    expect(() => world.setBlock(new Vec3(32, 32, 32))).toThrow(new RangeError('Index out of range'));
  });

  it('returns buffer on .dump()', () => {
    expect(world.dump()).toBeInstanceOf(Buffer);
  });

  it('returns a buffer of the correct size', () => {
    expect(world.dump().length).toBe(16 * 16 * 16 + 4);
  });

  it('saves and loads', async () => {
    const position = new Vec3(1, 2, 3);
    const block = 0x01;

    world.setBlock(position, block);
    await world.save();
    await world.load();

    await unlinkAsync('level.dat');

    expect(world.getBlock(position)).toBe(block);
  });
});
