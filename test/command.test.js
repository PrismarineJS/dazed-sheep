const Command = require('../src/command');

describe('Command', () => {
  let commands;

  beforeAll(() => {
    commands = new Command({});
  });

  it('can set op', () => {
    commands.setOp(true);

    expect(commands.params.op).toBe(true);
  });

  it('can be added to', () => {
    const options = {
      base: 'test',
      info: 'a test command',
      usage: '/test'
    }

    commands.add(options);

    expect(commands.hash.test.params).toEqual(options);
  });

  it('can perform action', () => {
    const message = 'This is an action';

    commands.add({
      base: 'another',
      action() {
        return message;
      }
    });

    expect(commands.hash.another.params.action()).toBe(message);
  });
});
