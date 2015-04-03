var async = require('async');
var child_process = require('child_process');
var os = require('os');
var moonStatus = {};
var err;

moonStatus.init = function(options, cb) {
    // Cpu: moonStatus.getCpuUsage(),
    // Network: moonStatus.getNetworkStatus(),
    // OS: moonStatus.getOSDetails(),
  // };

  async.parallel({
    Disk: function(callback){
      return moonStatus.getDiskInfo(options, callback);
    },
    Memory: function(callback){
      return moonStatus.getMemoryUsage(callback);
    },
    Cpu: function(callback) {
      return moonStatus.getCpuUsage(callback);
    },
    Cpu_Architecture: function(callback) {
      return moonStatus.getCpuArchitecture(callback);
    }
  },
  function(err, results) {
      return cb(err, results);
  });
};

moonStatus.getDiskInfo = function(options, callback) {
  var total = 0;
  var free = 0;
  var status = null;
  var percentageDisk;
  var drive = '/';
  if (!options.drive)
  {
    status = 'NOTFOUND';
    err = 'Drive is not defined, setting to default `/` ';
  }

  child_process.exec("df -k '" + drive.replace(/'/g,"'\\''") + "'", function(error, stdout, stderr)
  {
    if (error)
    {
      if (stderr.indexOf("No such file or directory") != -1)
      {
        status = 'NOTFOUND';
      }
      else
      {
        status = 'STDERR';
      }

      return callback(error,{stderr: stderr, stdout: stdout});
    }
    else
    {
      var lines = stdout.trim().split("\n");

      var str_disk_info = lines[lines.length - 1].replace( /[\s\n\r]+/g,' ');
      var disk_info = str_disk_info.split(' ');

      total = disk_info[1] * 1024;
      free = disk_info[3] * 1024;
      status = 'READY';
      percentageDisk = (total-free)/total * 100;
      return callback(null, {total: total, free: free, status: status, percentageDisk: percentageDisk + '%'});
    }
  });
};

moonStatus.getMemoryUsage = function(callback) {
  var obj = {
    totalMemory: os.totalmem(),
    useMemory: os.freemem(),
    precentageMemory: ((os.freemem() / os.totalmem() ) * 100) + '%'
  };
  return callback(null, obj);
};

moonStatus.getCpuUsage = function(callback) {
  var tmp = os.cpus();
  var obj = {
    Cpus: tmp,
    Counter: tmp.length
  };
  return callback(null, obj);
};

moonStatus.getCpuArchitecture = function (callback) {
  return callback(null, os.arch());
}

moonStatus.getNetworkStatus = function () {
  return os.networkInterfaces();
};

moonStatus.getOSDetails = function () {
  var obj = {
    Version: os.release(),
    Type: os.type(),
    Platform: os.platform()
  };
  return obj;
};



module.exports = moonStatus;