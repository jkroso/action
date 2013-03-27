
var action = require('../src')

var through = action(function(v){
	this.dispatch('out', v)
})

through
	.then({
		input: 'out',
		description: 'increment input by 1',
		action: function(v){
			this.dispatch('out', v + 1)
		}
	})
	.on({
		input: 'out',
		description: 'assert input is 6',
		action: function(v){
			console.assert(v === 6, 'input should equal 6')
		}
	})
	.then({
		input: 'out',
		description: 'log input to console',
		action: function(v){
			console.log(v)
		} 
	})

through.send(5)
