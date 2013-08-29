var IO = require('io');
var DeviceProxy = require('./deviceProxy');

module.exports = Room;

function Room(wsHost, roomId) {
	if (!(this instanceof Room)) return new Room(wsHost, roomId);
	this.roomId = roomId;
	this.wsHost = wsHost;
	
	//TODO: 
	//  Does io support nested channels? Can I just create a socket to the host and use 
	//  socket.channel(roomId)? Then will that support creating subchannels for devices?
	this.broadcastChannel = IO(wsHost + "/" + roomId + "/");

	this.broadcastChannel.on('deviceConnect', this.deviceConnected.bind(this));
	this.deviceConnectCallbacks = [];


	this.devices = {};
};

Room.prototype.channel = function(id) {
	return this.broadcastChannel.channel(id);
};

Room.prototype.onDeviceConnect = function(callback) {
	this.deviceConnectCallbacks.push(callback);
};

Room.prototype.broadcast = function(eventType, eventData) {
	this.broadcastChannel.emit(eventType, eventData);
};


Room.prototype.deviceConnected = function(device) {
	this.devices[device.deviceId] = new DeviceProxy(this, device);
	for (var callback in this.deviceConnectCallbacks) {
		callback(this.devices[device.deviceId]);
	}
	console.log('device connected');
};
