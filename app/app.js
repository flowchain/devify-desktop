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

var ondata = function(payload) {
	var obj = JSON.parse(payload.data);
	var paths = payload.pathname.split('/');
	var deviceId = paths[2];

 	$('#status').html(obj.temperature);
};

wsServer.start({
	ondata: ondata
});
