/// DOM
window.addEventListener('beforeunload', function() {
    wsServer.shutdown(function() {
    });
}, false);

// -----------------------------------------------------
// Start devify server
// -----------------------------------------------------

var WoT = require('wotcity.io');
var wsServer = WoT.Server.WebsocketBroker;

process.env.PORT = 8000;
process.env.HOST = '127.0.0.1';

// Get local IP address (IPv4)
var os = require('os');
var ifaces = os.networkInterfaces();

Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // this single interface has multiple ipv4 addresses
    } else {
      // this interface has only one ipv4 adress
      process.env.HOST = iface.address;
      return;
    }
    ++alias;
  });
});

var ondata = function(payload) {
	var obj = JSON.parse(payload.data);
	var paths = payload.pathname.split('/');
	var deviceId = paths[2];

 	$('#data').html(obj.temperature);
};

var onstart = function(payload) {
	$('#status').html("Server is at " + process.env.HOST + ":" + process.env.PORT );
};

wsServer.start({
	onstart: onstart,
	ondata: ondata
});
