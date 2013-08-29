/* Implicit dependencies */
var IO = require('io');
var Room = require('./room');

module.exports = Device;

function Device(deviceId) {
	if (!(this instanceof Device)) return new Device(deviceId);
	this.deviceId = deviceId;
	this.roomChannels = {};

	window.addEventListener('deviceorientation', this.onRotation.bind(this));
	window.addEventListener('touchstart', this.onTouchStart.bind(this));
	window.addEventListener('touchend', this.onTouchEnd.bind(this));
	window.addEventListener('devicemotion', this.onMotion.bind(this));
}

Device.prototype.joinRoom = function(room) {
	if (this.roomChannels[room] !== undefined) {
		console.log('Warning: Attempted to add device to room it already belongs to');
		return;
	}
	this.rooms[room] = room.broadcastChannel.channel(this.deviceId);
	this.rooms[room].emit('deviceConnect', {'deviceId' : this.deviceId});
};

Device.prototype.onRotation = function(rotationEvent) {
	for (var room in this.roomChannels) {
		this.roomChannels[room].emit('rotation', { 
			"alpha" : rotationEvent.alpha,
			"beta"	: rotationEvent.beta,
			"gamma" : rotationEvent.gamma
		});
	}
};

Device.prototype.onTouchStart = function(touchEvent) {
	for (var room in this.roomChannels) {
		this.roomChannels[room].emit('touchStart', {});
	}
};

Device.prototype.onTouchEnd = function(touchEvent) {
	for (var room in this.roomChannels) {
		this.roomChannels[room].emit('touchEnd', {
			"touches" : touchEvent.touches
		});
	}
};

Device.prototype.onMotion = function(motionEvent) {
	for (var room in this.roomChannels) {
		this.roomChannels[room].emit('motion', {
			"acceleration" : motionEvent.acceleration,
			"accelerationIncludingGravity" : motionEvent.accelerationIncludingGravity,
			"rotationRate" : motionEvent.rotationRate,
			"interval" : motionEvent.interval
		});
	}
};