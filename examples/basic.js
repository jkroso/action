
var action = require('..')

var start = action(function(v){
	this.out(v)
})

var up = action(function(v){
	this.out('up', v + 1)
})

var down = action(function(v){
	this.out('down', v - 1)
})

var log = action(function(){
	console.log.apply(console, arguments)
})

start.connect(up).connect(log)
start.connect(down).connect(log)

start.send(2)