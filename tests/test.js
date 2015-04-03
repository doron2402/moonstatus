'use strict';
var assert = require("assert")
var moonStatus = require("../lib");

describe('Array', function(){
  describe('#indexOf()', function(){
    it('should return -1 when the value is not present', function(){
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    })
  })
});

describe('MoonStatus', function(){
  describe('When passing empty option object', function(){
    var options = {};
    it('should return object', function(done){
      moonStatus.init(options, function(err, res){
        console.log(err);
        console.log(res);
        done();
      });
    });
  })
});

