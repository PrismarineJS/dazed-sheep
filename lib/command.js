'use strict';

class Command {
  constructor(params, parent, hash) {
    this.params = params;
    this.parent = parent;
    this.hash = parent ? parent.hash : {};
    this.uniqueHash = parent ? parent.uniqueHash : {};
    this.parentBase = (this.parent && this.parent.base && this.parent.base + ' ') || '';
    this.base = this.parentBase + (this.params.base || '');

    if(this.params.base) {
      this.updateHistory();
    }
  }

  find(command) {
    if(command.split('')[0] == '/') {
      command = command.split('').splice(1).join('');
    } else {
      command = command.split('').splice(0).join('');
    }
    
    const parts = command.split(' ');
    const c = parts.shift();
    const pars = parts.join(' ');
    
    if(this.hash[c])
      return [this.hash[c], pars];

    return undefined;
  }

  use(command) {
    var op = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

    let res = this.find(command);

    if(res) {
      let com = res[0];
      let pars = res[1];

      if (com.params.op && !op) 
        return '&cYou do not have permission to use this command';

      const parse = com.params.parse;
      if(parse) {
        if(typeof parse == 'function') {
          pars = parse(pars);
          if(pars === false) {
            return '&cUsage: ' + com.params.usage
          }
        } else {
          pars = pars.match(parse);
        }
      }
      
      res = com.params.action(pars);

      if(res) 
        return '' + res;
    } else {
      return '&cUnknown command. Try /help for a list of commands';
    }
  }

  updateHistory() {
    const all = '(.+?)';

    const list = [this.base];
    if(this.params.aliases && this.params.aliases.length) {
      this.params.aliases.forEach(al => list.unshift(this.parentBase + al));
    }

    list.forEach((command) => {
      const parentBase = this.parent ? (this.parent.path || '') : '';
      this.path = parentBase + this.space() + (command || all);
      if(this.path == all && !this.parent) this.path = '';

      if(this.path) this.hash[this.path] = this;
    });
    this.uniqueHash[this.base] = this;
  }

  space(end) {
    const first = !(this.parent && this.parent.parent);
    return this.params.merged || (!end && first) ? '' : ' ';
  }

  add(params) {
    return new Command(params, this);
  }

  setOp(op) {
    this.params.op = op;
  }
}

module.exports = Command;