var IO = require('io');

module.exports = DeviceProxy;

function DeviceProxy(room, device) {
	if (!(this instanceof DeviceProxy)) return new DeviceProxy(room, device);
	this.room = room;
	this.device = device;
	this.deviceId = device.deviceId;
	this.socket = room.broadcastChannel.channel(this.device.deviceId);
};

DeviceProxy.prototype.on = function(eventType, callback) {
	this.socket.on(eventType, callback);
};