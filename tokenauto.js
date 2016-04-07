var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'Local Token Service',
  description: 'MPS Local Token Service',
  script: 'pm2 start d:\\james\\mpstokenserver\\bin\\www'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();
