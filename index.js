
/**
 * Module dependencies
 */

var call = Function.prototype.call

/**
 * Action constructor
 * @param {Function|Object} fn
 */

function Action(fn){
	if (typeof fn == 'function') this.stdin = fn
	else for (var f in fn) this[f] = fn[f]
	this.pins = {}
}

// (string) -> object
function parseConnection(str){
	if (typeof str != 'string' || !str) return {from: 'stdout', to: 'stdin'}
	str = str.split('=>')
	return {
		from: str[0],
		to: str[1] || 'stdin'
	}
}

/**
 * connect `action` to `this` actions `pin`. If you don't
 * provide a `pin` actions name will be used and failing 
 * that "stdout"
 *
 * @param {String} [pin] "from=>to"
 * @param {Function|Action} action
 * @return {Action}
 */

Action.prototype.then = function(pin, action){
	if (typeof pin != 'string') action = pin, pin = action.name
	var con = parseConnection(pin)
	pin = con.from;
	(this.pins[pin] || (this.pins[pin] = [])).push(con)
	return con.action = toAction(action)
}

/**
 * a chainable `.then()`
 * 
 * @param {String} [pin]
 * @param {Function|Action} action
 * @return {this}
 */

Action.prototype.on = function(pin, action){
	this.then(pin, action)
	return this
}

/**
 * execute actions connected to `pin`. Any extra arguments
 * will be forwarded to the receiving actions
 * 
 * @param {String} pin
 * @return {this}
 */

Action.prototype.dispatch = function(pin){
	var cons = this.pins[pin]
	if (cons) for (var i = 0, len = cons.length; i < len; i++) {
		var con = cons[i]
		pin = con.action
		call.apply(pin[con.to], arguments)
	}
	return this
}

/**
 * create a hard pin on `this` action. hard pins afford nicer 
 * syntax and perform better
 * 
 * @param {String} name
 * @return {this}
 */

Action.prototype.pin = function(name){
	this[name] = function(){
		var cons = this.pins[name], a, c
		if (!cons) return this
		for (var i = 0, len = cons.length; i < len; i++) {
			(a = (c = cons[i]).action)[c.to].apply(a, arguments)
		}
		return this
	}
	return this
}

/**
 * default hard pin
 */

Action.prototype.pin('stdout')

// (Function|Object|Action) -> Action
function toAction(x){
	if (x instanceof Action) return x
	if (typeof x == 'function') return new Action(x)
	if (x.pins == null) x.pins = {}
	if (x.on == null) x.on = Action.prototype.on
	if (x.then == null) x.then = Action.prototype.then
	if (x.pin == null) x.pin = Action.prototype.pin
	if (x.dispatch == null) x.dispatch = Action.prototype.dispatch
	return x
}

// set exports
module.exports = function(fn){
	return new Action(fn || forward)
}

function forward(){
	this.stdout.apply(this, arguments)
}

module.exports.Action = Action
module.exports.toAction = toAction
module.exports.parseConnection = parseConnection

// aliases
Action.prototype.connect = Action.prototype.then
