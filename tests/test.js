'use strict';
var assert = require('assert');
var should = require('should');
var moonStatus = require('../lib');

describe('MoonStatus', function(){

  describe('When passing empty options object', function(){
    var options = {};
    it('should return object with all the right properties', function(done){
      moonStatus.init(options, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.should.have.property('Memory');
        result.should.have.property('Cpu');
        result.should.have.property('Cpu_Architecture');
        result.should.have.property('Network');
        result.should.have.property('OS');
        result.should.have.property('Disk');
        done();
      });
    });
  });

  describe('When passing a null option', function(){
    it('should return object with all the right properties', function(done){
      moonStatus.init(null, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.should.have.property('Memory');
        result.should.have.property('Cpu');
        result.should.have.propertyByPath('Cpu', 'Counter').above(0);
        result.should.have.property('Cpu_Architecture');
        result.should.have.property('Network');
        result.should.have.property('OS');
        result.should.have.property('Disk');
        done();
      });
    });
  });

  describe('When options.drive is unknown', function() {
    var options = {
      drive: '/unknownDrive'
    };
    it('should return object with all the right properties', function(done){
      moonStatus.init(options, function(err, result){
        err.should.have.property('killed',false);
        err.should.have.property('code',1);
        err.should.have.property('signal',null);
        should.exist(result);
        result.should.have.property('Memory');
        result.should.have.property('Cpu');
        result.should.have.property('Cpu_Architecture');
        result.should.have.property('Network');
        result.should.have.property('OS');
        result.should.have.property('Disk');
        result.should.have.propertyByPath('Disk', 'stderr');
        result.should.have.propertyByPath('Disk', 'stdout');
        done();
      });
    });
  });

  describe('When options.drive is set to mount drive `/` -- (Running On Mac/Linux) --', function() {
    var options = {
      drive: '/'
    };
    it('should return object with all the right properties', function(done){
      moonStatus.init(options, function(err, result){
        should.not.exist(err);
        should.exist(result);

        result.should.have.propertyByPath('Memory','totalMemory');
        result.should.have.propertyByPath('Memory','useMemory');
        result.should.have.propertyByPath('Memory','precentageMemory');

        result.should.have.propertyByPath('Cpu','Cpus');
        result.should.have.propertyByPath('Cpu','Counter');

        result.should.have.property('Cpu_Architecture');

        result.should.have.property('Network');

        result.should.have.propertyByPath('OS','Version');
        result.should.have.propertyByPath('OS','Type');
        result.should.have.propertyByPath('OS','Platform');

        result.should.have.propertyByPath('Disk', 'total');
        result.should.have.propertyByPath('Disk', 'free');
        result.should.have.propertyByPath('Disk', 'status');
        result.should.have.propertyByPath('Disk', 'percentageDisk');
        done();
      });
    });
  });

  describe('When options.disk is false', function() {
    var options = {
      disk: false
    };
    it('should return undefined disk property', function(done){
      moonStatus.init(options, function(err, result){
        should.not.exist(err);
        should.exist(result);
        result.should.have.property('Disk',undefined);
        result.should.not.have.propertyByPath('Disk', 'total');
        result.should.not.have.propertyByPath('Disk', 'free');
        result.should.not.have.propertyByPath('Disk', 'status');
        result.should.not.have.propertyByPath('Disk', 'percentageDisk');
        done();
      });
    });
  });

});

