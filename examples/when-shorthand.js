
var action = require('..')

var voice = action(function(letter){
		if (/[A-Z]/.exec(letter)) return this.dispatch('upper', letter)
		if (/[a-z]/.exec(letter)) return this.dispatch('lower', letter)
	})
	.when(function upper(letter){
		console.log(letter+'!')
	})
	.when(function lower(letter){
		console.log('pssst '+letter)
	})

voice.send('hello world')
voice.send('Hello World')