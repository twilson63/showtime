var domify = require('domify')
var cssify = require('cssify')

var font = "<link href='//fonts.googleapis.com/css?family=Raleway:400,300,600' rel='stylesheet' type='text/css'>"
document.head.appendChild(domify(font))
var bodyStyle = "<style type='text/css'>body { background-color: '#add8e6'; color: '#fff'; }</style>"
document.head.appendChild(domify(bodyStyle))

var xhr = require('xhr')
var url = require('url')

var Immutable = require('immutable')
//var R = require('ramda')

var main = require('main-loop')
var h = require('virtual-dom/h')

var state = Immutable.Map({
	current: Number(location.pathname.slice(1) || '0') || 0,
	slides: ['# No Slides']
})

var loop = main(state, render, require('virtual-dom'))
document.body.appendChild(loop.target)

// get slides
xhr('/slides.md', loadSlides)
//loadSlides(null, null, '# Hello World\n\nbeep boop\n---\n### List\n\n* point 1\n* point 2\n---\n## Goodbye Moon\n---\n! http://foo.jpg.to\n---\n# The End')
function loadSlides (err, res, body) {
	state = state.set('slides', body.toString().split('\n---\n'))
	loop.update(state)
}

var h1 = {
	'font-size': '700%',
	'line-height': '1.2',
	'text-align': 'center',
	'margin': '270px 0 0'
}

var h2 = {
	'font-size': '500%',
	'line-height': '1.2',
	'text-align': 'center',
	'margin': '240px 0 0'
}

var h3 = {
	'font-size': '400%',
	'line-height': '1.2',
	'text-align': 'center',
	'margin': '100px 0 0'
}

var p = {
	'font-size': '200%',
	'text-align': 'center',
	'margin': '50px 0 0'
}

var codeCss = {
	'font-size': '200%',
	'margin': '50px 0 0 200px'
}

var img = {
	'position': 'absolute',
	'top': '50%',
	'left': '50%',
	'width': '1000px',
	'height': '1000px',
	'margin-top': '-500px',
	'margin-left': '-500px'	
}

var bullet = {
	'font-size': '200%',
	'line-height': '1.2',
	'margin': '20px 0 0 200px'
}

function render (state) {
	var slide = state.get('slides')[state.get('current')]
	var incode = false
	var code = []

	return h('div', slide.split('\n').map(function (l) {
			if (/^###/.test(l)) {
				return h('h3', { style: h3 }, l.replace('###', ''))
			}
			
			if (/^##/.test(l)) {
				return h('h2', { style: h2 }, l.replace('## ', ''))
			}
			
			if (/^#/.test(l)) {
				return h('h1', { style: h1 }, l.replace('# ', ''))	
			}
			
			if (/^!/.test(l)) {
				return h('img', { style: img, src: l.replace('! ', '') })
			}
			
			if (/^\*/.test(l)) {
				return h('p', { style: bullet }, l.replace('*', '-'))
			}
			
			if (!incode && /^```/.test(l)) {
				incode = true	
				code = []
				return
			}
			
			if (incode && /^```/.test(l)) { 
				incode = false
				return h('pre', [
					h('code', { style: codeCss }, code.join('\n'))
				])
			}
			
			if (incode) {
				code.push(l)
				return
			}
			
			if (/^link/.test(l)) {
				return h('p', {style: p}, [
					h('a', { href: l.replace('link ',''), target: '_blank'}, '[Click Here]')
				])
			}
			
			return h('p', {style: p}, l)
		})
	)
}

window.addEventListener('keydown', function (ev) {
  var current = state.get('current')
  var slides = state.get('slides')

	if (ev.keyCode === 37) { // left
    show(current - 1)
  }
  else if (ev.keyCode === 39) { // right
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
  var n = Number(location.pathname.slice(1) || '0') || 0
  show(n)
})

function show (n) {
  var slides = state.get('slides')
	n = Math.max(0, n) % slides.length
  state = state.set('current', n)
  window.history.pushState(null, String(n), '#/' + n);
  loop.update(state);
  window.scrollTo(0, 0);

}