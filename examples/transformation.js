
var action = require('..')

function log(val){
	console.log('%s', JSON.stringify(val, null, 1))
}

var key = action(function(e){
	switch (e.which) {
		case 37: this.dispatch('left', e); break
		case 38: this.dispatch('up', e); break
		case 39: this.dispatch('right', e); break
		case 40: this.dispatch('down', e); break
	}
})

key.connect(function left(e){
		e.key = 'left'
		e.x--
		this.out(e)
	})
	.connect('out', log)

key.connect(function up(e){
		e.key = 'up'
		e.y--
		this.out(e)
	})
	.connect('out', log)

key.connect(function right(e){
		e.key = 'right'
		e.x++
		this.out(e)
	})
	.connect('out', log)

key.connect(function down(e){
		e.key = 'down'
		e.y++
		this.out(e)
	}).connect('out', log)

key.send({which:37, x:10, y:10})
key.send({which:38, x:10, y:10})
key.send({which:39, x:10, y:10})
key.send({which:40, x:10, y:10})
