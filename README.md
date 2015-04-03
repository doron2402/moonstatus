# moonstatus
  Great module for return your server/instance status

## Why
  We want to add a route to Express.js or Hapi.js that will give us the instance status memory, cpu and disk usage.

## How
  Using the native node.js 'os'


## Getting Started
  ```javascript
  var ms = require('moonstatus');
  ms.init({drive: '/'}, function(err, result) {
    //result will contain all the values you need.
    {
      Memory: {
        totalMemory: Number,
        useMemory: Number,
        precentageMemory: String
      },
      Cpu: {
        Cpus: [ Object,.. ],
        Counter: Number
      },
      Cpu_Architecture: String,
      Network: {
        lo0: [ [Object], [Object], [Object] ],
        en0: [ [Object], [Object] ],
        vboxnet0: [ [Object] ]
      },
      OS: {
        Version: String,
        Type: String,
        Platform: String
      },
      Disk: {
        total: Number,
        free: Number,
        status: String,
        percentageDisk: String
      }
    }
  });
  ```

### When Using Express
  ```javascript
  var ms = require('moonstatus');
  app.get('/instance/status', function(request, response){
    ms.init({drive: '/'}, function(err, result) {
      if (err) {
        Logger(err); //You probably will want to log it.
      }
      return response.send(result);
    });
  });
  ```
### When Using Hapi.js
  ```javascript
  var ms = require('moonstatus');
  server.route({
    method: 'GET',
    path: '/instance/status',
    handler: function (request, reply) {
      ms.init({drive: '/'}, function(err, result) {
        if (err) {
          Logger(err); //You probably will want to log it.
        }
        return reply(result);
      });
    }
  });
  ```

## Good Luck!
