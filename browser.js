var xhr = require('xhr')
var Immutable = require('immutable')
var main = require('main-loop')

var state = Immutable.Map({
	current: Number(location.hash.slice(2) || '0') || 0,
	slides: ['# No Slides'],
	transition: false,
	direction: 'right'
})

var loop = main(state, require('./render'), require('virtual-dom'))

document.body.appendChild(loop.target)

// get slides
var buildSlides = module.exports = function (slides) {
	xhr(slides, function (err, res, body) {
		state = state.set('slides', body.toString().split('\n---\n'))
		loop.update(state)
	})
}

if (!module.parent) {
	buildSlides('/slides.md')
}

window.addEventListener('touchstart', function (e) {
	
})

window.addEventListener('keydown', function (ev) {
  var current = state.get('current')
  var slides = state.get('slides')

	if (ev.keyCode === 37) { // left
		state = state.set('direction', 'left')
    show(current - 1)
  }
  else if (ev.keyCode === 39) { // right
  	state = state.set('direction', 'right')
    show(current + 1)
  }
  else if (ev.keyCode === 48 || ev.keyCode === 36) { // 0 or home
    show(0)
  }
  else if ((ev.keyCode === 52 && ev.shiftKey) // $
  || ev.keyCode === 35) { // end
		show(slides.length - 1)
  }
})



window.addEventListener('popstate', function (ev) {
  var n = Number(location.hash.slice(2) || '0') || 0
  show(n)
})

function show (n) {
	state = state.set('transition', true)
  loop.update(state);

  setTimeout(function () {
		var slides = state.get('slides')
		n = Math.max(0, n) % slides.length
	  state = state.set('current', n)
	  window.history.pushState(null, String(n), '#/' + n);
	  state = state.set('transition', false)
	  loop.update(state);
	  window.scrollTo(0, 0);
  }, 200)
}
