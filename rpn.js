stack = [0];
lastStack = stack.slice();
autopush = false;
deg = false;
inputtingDecimal = false;
hasDecimal = false;

function repaint() {
	$('.stack').html('');
	stack.forEach((x,i) => $('.stack').append('<div class="stackObject obj' + i + '">' + x + '</div>'));
}

function push(x) {
	if(x === undefined) x = stack[0];
	stack.unshift(x);
	$('.stack').children().each((i,x) => {
		$(x).removeClass('obj' + i).addClass('obj' + (i+1));
	});
	$('.stack').prepend('<div class="stackObject obj0">' + x + '</div>');
}

function pop() {
	$('.stack').children().each((i,x) => {
		$(x).removeClass('obj' + i).addClass('obj' + (i-1));
	});
	$('.obj-1').detach();
	return Number(stack.shift());
}

function add() {
	push(pop() + pop());
}

function sub() {
	push((-pop()) + pop());
}

function multiply() {
	push(pop() * pop());
}

function divide() {
	var d = pop();
	var n = pop();
	push(n / d);
}

function root() {
	var r = pop();
	push(Math.pow(pop(), 1/r));
}

function pow() {
	var ex = pop();
	push(Math.pow(pop(), ex));
}

function sin() {
	var a = pop();
	if(deg) a = a / 360 * (2*Math.PI);
	push(Math.sin(a));
}

function cos() {
	var a = pop();
	if(deg) a = a / 360 * (2*Math.PI);
	push(Math.cos(a));
}

function tan() {
	var a = pop();
	if(deg) a = a / 360 * (2*Math.PI);
	push(Math.tan(a));
}

function arcsin() {
	var r = Math.asin(pop());
	if(deg) r = r / (2*Math.PI) * 360;
	push(r);
}

function arccos() {
	var r = Math.acos(pop());
	if(deg) r = r / (2*Math.PI) * 360;
	push(r);
}

function arctan() {
	var r = Math.atan(pop());
	if(deg) r = r / (2*Math.PI) * 360;
	push(r);
}

function trim(x) {
	while(x.indexOf('0') === 0)
		x = x.substring(1);
	if(x.length === 0)
		x = "0";
	return x;
}

function clear() {
	stack = [0];
	autopush = false;
	repaint();
	flashSuccess();
}

function flashSuccess() {
	$('html').css('background-color', '#00f');
	setTimeout(()=> $('html').css('background-color', '#000'), 75);
}

function flashError() {
	$('html').css('background-color', '#f00');
	setTimeout(()=> $('html').css('background-color', '#000'), 75);
}

function assert(n) {
	if(stack.length < n) {
		flashError();
		return false;
	}
	return true;
}

function pressKey(x) {
	if(x === "Enter")
		x = "`"

	if(x.length > 1)
		return x.split("").forEach(pressKey);

	if($.isNumeric(x)) {
		if(autopush) {
			if(!pushed) push();
			pop();
			push(x);
			autopush = false;
		}
		else {
			if(inputtingDecimal) {
				x = '.' + x;
				inputtingDecimal = false;
				hasDecimal = true;
			}
			push(trim(pop() + x));
		}
	}
	else {
		oldautopush = autopush;
		autopush = true;
		pushed = false;
		oldLastStack = lastStack.slice();
		lastStack = stack.slice();
		switch (x) {
			case '+':
				if(assert(2)) add();
				break;
			case '-':
				if(assert(2)) sub();
				break;
			case '*':
				if(assert(2)) multiply();
				break;
			case '/':
				if(assert(2)) divide();
				break;
			case 'r':
				push(2);
				root();
				break;
			case 'R':
				if(assert(2)) root();
				break
			case 's':
				push(2);
				pow();
				break;
			case '^':
				if(assert(2)) pow();
				break;
			case 'j':
				sin();
				break;
			case 'k':
				cos();
				break;
			case 'l':
				tan();
				break;
			case 'u':
				arcsin();
				break;
			case 'i':
				arccos();
				break;
			case 'o':
				arctan();
				break;
			case '.':
				autopush = false;
				if(hasDecimal) break;
				push(pop() + '.');
				inputtingDecimal = true;
				break;
			case 'p':
				var o = pop();
				if(o) push(o);
				push(Math.PI);
				break;
			case 't':
				var o = pop();
				if(o) push(o);
				push(2*Math.PI);
				break;
			case '@':
				lastStack = oldLastStack;
				deg = !deg;
				$('.deg').text(deg ? "deg" : "rad");
				flashSuccess();
				break;
			case 'z':
				lastStack = oldLastStack;
				var tmp = stack.slice();
				stack = lastStack.slice();
				lastStack = tmp.slice();
				repaint();
				flashSuccess();
				break;
			case '`':
				push();
				pushed = true;
				break;
			case '~':
				lastStack = oldLastStack;
				autopush = oldautopush;
				var s = pop().toString();
				push(trim(s.substring(0, s.length-1)));
				break;
			case 'c':
				clear();
				break;
			default:
				flashError();
				console.log('? ' + x);
				lastStack = oldLastStack;
				autopush = oldautopush;
		}
	}
}

$('body').keypress((x) => pressKey(x.key));
$('body').keydown((x) => {
	if(x.key === "Backspace") pressKey('~');
});
repaint();
