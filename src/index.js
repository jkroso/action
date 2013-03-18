
var slice = require('sliced')

module.exports = function(fn){
	return new Action(fn)
}

module.exports.class = function(fn, pins){
	return function(){
		var act = new Action(fn)
		if (pins) {
			for (var i = 0, len = pins.length; i < len; i++) {
				act.pin(pins[i])
			}
		}
		return act
	}
}

module.exports.Action = Action

function Action(fn){
	this.action = 
	this.send = fn
	this.pins = {}
	this.pin('out')
}

Action.prototype.when = function(pin, action){
	if (typeof pin != 'string') {
		action = pin
		pin = typeof pin == 'function' && pin.name 
			? pin.name
			: 'out'
	}
	if (typeof action == 'function') action.send = action;
	(this.pins[pin] || (this.pins[pin] = [])).push(action)
	return this
}

Action.prototype.connect = function(pin, action){
	if (typeof pin != 'string') {
		action = pin
		pin = typeof pin == 'function' && pin.name 
			? pin.name
			: 'out'
	}
	if (typeof action == 'function') action = new Action(action);
	(this.pins[pin] || (this.pins[pin] = [])).push(action)
	return action
}

Action.prototype.pin = function(name){
	this[name] = this.dispatch.bind(this, name)
	return this
}

Action.prototype.dispatch = function(pin){
	var args = slice(arguments, 1)
	var acts = this.pins[pin]
	if (!acts) return this
	for (var i = 0, len = acts.length; i < len; i++) {
		var act = acts[i]
		act.send.apply(act, args)
	}
	return this
}
