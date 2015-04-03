var child_process = require('child_process');
var os = require('os');
var moonStatus = {};
var err;

moonStatus.init = function(options, res) {

  var objResult = {
    Memory: moonStatus.getMemoryUsage(),
    Cpu: moonStatus.getCpuUsage(),
    Network: moonStatus.getNetworkStatus(),
    OS: moonStatus.getOSDetails(),
    Cpu_Architecture: moonStatus.getCpuArch()
    Disk: moonStatus.getDiskInfo(options)
  };

  if (res && typeof res.send === 'function') {
    //express app res is defined
    return res.send(objResult);
  } else {
    //return a callback
    return res(err, objResult);
  }


};

moonStatus.getMemoryUsage = function() {
  var obj = {
    totalMemory: os.totalmem(),
    useMemory: os.freemem(),
    precentageMemory: ((os.freemem() / os.totalmem() ) * 100) + '%'
  };
  return obj;
};

moonStatus.getCpuUsage = function() {
  return os.cpus();
};

moonStatus.getCpuArch = function () {
  return os.arch();
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

moonStatus.getDiskInfo = function(options) {
  var total = 0;
  var free = 0;
  var status = null;
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

      // callback ? callback(error, total, free, status)
           // : console.error(stderr);
      return {error: error, stderr: stderr, stdout: stdout};
    }
    else
    {
      var lines = stdout.trim().split("\n");

      var str_disk_info = lines[lines.length - 1].replace( /[\s\n\r]+/g,' ');
      var disk_info = str_disk_info.split(' ');

      total = disk_info[1] * 1024;
      free = disk_info[3] * 1024;
      status = 'READY';
      //callback && callback(null, total, free, status);
      return {total: total, free: free, status: status};
    }
  });
};

module.exports = moonStatus;