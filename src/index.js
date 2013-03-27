
var slice = require('sliced')

module.exports = function(fn){
	return new Action(fn || forward)
}

function forward(){
	this.out.apply(this, arguments)
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

Action.prototype.on = function(pin, action){
	if (typeof pin != 'string') {
		action = pin
		pin = typeof pin == 'function' 
			? pin.name || 'out'
			: 'out'
	}
	(this.pins[pin] || (this.pins[pin] = [])).push(toAction(action))
	return this
}

Action.prototype.then =
Action.prototype.connect = function(pin, action){
	if (typeof pin != 'string') {
		action = pin
		pin = typeof pin == 'function' && pin.name 
			? pin.name
			: 'out'
	}
	(this.pins[pin] || (this.pins[pin] = [])).push(toAction(action))
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

function toAction(x){
	if (typeof x == 'function') return new Action(x)
	if (x instanceof Action) return x
	if (x.on == null) x.on = Action.prototype.on
	if (x.pin == null) x.pins = {}
	if (x.then == null) x.then = Action.prototype.then
	if (x.dispatch == null) x.dispatch = Action.prototype.dispatch
	if (x.send == null) x.send = x.action
	return x
}
