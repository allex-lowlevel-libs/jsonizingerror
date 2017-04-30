var expect = require('chai').expect,
  inherit = require('allex_inheritlowlevellib').inherit,
  AllexError = require('allex_errorlowlevellib')(inherit),
  AllexJSONizingError = require('..')(AllexError, inherit);

function plainthrower () {
  throw new AllexJSONizingError('PLAIN_OBJ_ERROR', {
    a: 5,
    b: 'blah'
  }, 'Plain');
}

function circularthrower () {
  var a = {prev: null, next: null},
    b = {prev: null, next: null},
    c = {prev: null, next: null},
    err;
  a.prev = c;
  a.next = b;
  b.prev = a;
  b.next = c;
  c.prev = b;
  c.next = a;
  err = new AllexJSONizingError('CIRCUALR_OBJ_ERROR', a, 'Aha');
  console.log('err', err);
  throw err;
}

describe('Basic tests', function () {
  it('Error from a plain object', function () {
    expect(plainthrower).to.throw('blah');
  });
  it('Error from a circular object', function () {
    expect(circularthrower).to.throw('prev');
  });
});
