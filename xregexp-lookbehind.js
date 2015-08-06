'use strict';

// modified from https://gist.github.com/slevithan/2387872

exports.prepareLb = function (lb) {
  // Allow mode modifier before lookbehind
  var parts = /^((?:\(\?[\w$]+\))?)\(\?<([=!])([\s\S]*)\)$/.exec(lb);

  return {
    // $(?!\s) allows use of (?m) in lookbehind
    lb: this(parts ? parts[1] + '(?:' + parts[3] + ')$(?!\\s)' : lb),
    // Positive or negative lookbehind. Use positive if no lookbehind group
    type: parts ? parts[2] === '=' : !parts
  };
};

exports.execLb = function (str, lb, regex) {
  var pos = 0, match, leftContext;

  lb = this.prepareLb(lb);

  while ((match = this.exec(str, regex, pos))) {
    leftContext = str.slice(0, match.index);

    if (lb.type === lb.lb.test(leftContext)) {
      return match;
    }

    pos = match.index + 1;
  }

  return null;
};

exports.testLb = function (str, lb, regex) {
  return this.execLb(str, lb, regex) !== null;
};

exports.searchLb = function (str, lb, regex) {
  var match = this.execLb(str, lb, regex);

  return match ? match.index : -1;
};

exports.matchAllLb = function (str, lb, regex) {
  var matches = [], pos = 0, match, leftContext;

  lb = this.prepareLb(lb);

  while ((match = this.exec(str, regex, pos))) {
    leftContext = str.slice(0, match.index);

    if (lb.type === lb.lb.test(leftContext)) {
      matches.push(match[0]);

      pos = match.index + (match[0].length || 1);
    } else {
      pos = match.index + 1;
    }
  }

  return matches;
};

exports.replaceLb = function (str, lb, regex, replacement) {
  var output = '', pos = 0, lastEnd = 0, match, leftContext;

  lb = this.prepareLb(lb);

  while ((match = this.exec(str, regex, pos))) {
    leftContext = str.slice(0, match.index);

    if (lb.type === lb.lb.test(leftContext)) {
      // Doesn't work correctly if lookahead in regex looks outside of the
      // match
      output += str.slice(lastEnd, match.index) +
        this.replace(match[0], regex, replacement);

      lastEnd = match.index + match[0].length;

      if (!regex.global) {
        break;
      }

      pos = match.index + (match[0].length || 1);
    } else {
      pos = match.index + 1;
    }
  }

  return output + str.slice(lastEnd);
};
