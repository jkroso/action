
var chai = require('./chai')
  , action = require('..')

describe('action', function () {
	it('basic case', function (done) {
		var start = action(function(v){
			this.stdout(v)
		})
		var up = action(function(v){
			this.stdout(v + 1)
		})
		start.then(up).then(function(v){
			v.should.equal(3)
			done()
		})
		start.stdin(2)
	})

	it('pin selection', function () {
		var node = action({
			keyup: function(e){
				this.state = 'up'
			},
			keydown: function(e){
				this.state = 'down'
			}
		})

		var dom = action()
			.on('keydown=>keydown', node)
			.on('keyup=>keyup', node)

		dom.dispatch('keydown')
		node.should.have.property('state', 'down')
		dom.dispatch('keyup')
		node.should.have.property('state', 'up')
	})
})
