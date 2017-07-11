/// DOM
window.addEventListener('beforeunload', function() {
    wsServer.shutdown(function() {
    });
}, false);



// -----------------------------------------------------
// Start devify server
// -----------------------------------------------------

/**
 * Main WoT Framework
 */
var WoT = require('wotcity.io');

/**
 * WoT Modules
 */
var Framework = WoT.Framework
  , WebsocketBroker = WoT.WebsocketBroker
  , WebsocketRouter = WoT.WebsocketRouter
  , RequestHandlers = WoT.WebsocketRequestHandlers
  , Runtime = WoT.Runtime;

/**
 * Util Modules
 */
var merge = require('utils-merge');

/**
 * Websocket URL Router
 */
var wsHandlers = {
   "/object/([A-Za-z0-9-]+)/send": RequestHandlers.send,
   "/object/([A-Za-z0-9-]+)/viewer": RequestHandlers.viewer,
   "/object/([A-Za-z0-9-]+)/status": RequestHandlers.status
};

/*
 * Prototype and Class
 */
var Server = function () {
    this.server = null;
};

/**
 * The server event handlers
 */
Server.prototype.onNewThing = function(thing) {
};

Server.prototype.onData = function(payload) {
  if (typeof(this._options.onmessage) === 'function') {
    this._options.onmessage(payload);
  }
};

/**
 * Create an WoT server.
 *
 * @return {Object}
 * @api public
 */
function createServer(options) {
  var instance = new Server();

  return merge(instance, options);
}

/**
 * Start a Websocket server.
 *
 * @return {None}
 * @api public
 */
Server.prototype.start = function(options) {
  var port = process.env.PORT || 8000;
  var host = process.env.HOST || 'localhost';
  var options = options || {};

  for (var prop in options) {
    if (options.hasOwnProperty(prop)
        && typeof(this._options[prop]) === 'undefined')
      this._options[prop] = options[prop];
  }

  var server = new WebsocketBroker({
    port: port,
    host: host
  });
  var router = new WebsocketRouter();

  // Thing events from WoT framework
  server.on('data', this.onData.bind(this));

  server.start(router.route, wsHandlers);

  this.server = server;
};

Server.prototype.shutdown = function(cb) {
  if (this.server)
    this.server.shutdown(cb);
}

/**
 * Create the server instance.
 */
var wsBrokerImpl = createServer({
  events: {
  }
});

/**
 * Combined server with framework instance.
 */
var wsServer = new Framework({
    server: wsBrokerImpl
});
// -----------------------------------------------------
// End of devify server
// -----------------------------------------------------

var jsrender = require('jsrender');
var tmpl = jsrender.templates( $('#itemTemplate').html() );

var onmessage = function(message) {
    // Parse strings to JSON object.
    var obj = JSON.parse(message.data);

    // Render a template
    var html = tmpl.render(obj);
    $('#itemList').prepend(html);
};

process.env.PORT = 8000;
process.env.HOST = '127.0.0.1';

wsServer.start({
    onmessage: onmessage
});
