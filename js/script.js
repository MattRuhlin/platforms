$(document).ready(function() {
	// initalize Snap
	var s = Snap('#svg');

	// set window height and width
	var WIDTH = $(window).width();
	var HEIGHT = $(window).height();

	// initalize aboutVisible variable - as it sounds
	var aboutVisible = false;
	var aboutLink = $('#about-link')
	var closeBtn = $('.closebtn');

	// initialize elements and platforms

	if ($(window).width() <= 650) {
		var circle = s.circle(multipleFiveX(.90), multipleFiveY(.15),multipleFiveX(.046));
		var rect = s.rect(multipleFiveX(.80),multipleFiveY(.33),multipleFiveX(.15),multipleFiveX(.10));
		var square = s.rect(multipleFiveX(.75),multipleFiveY(.16),multipleFiveX(.08),multipleFiveX(.08));
		var triangle = s.polygon(multipleFiveX(.56),multipleFiveY(.22),multipleFiveX(.56),multipleFiveY(.11),multipleFiveX(.68),multipleFiveY(.12));
	}

	else {
		var circle = s.circle(multipleFiveX(.90), multipleFiveY(.15),multipleFiveX(.026));
		var rect = s.rect(multipleFiveX(.80),multipleFiveY(.33),multipleFiveX(.07),multipleFiveY(.05));
		var square = s.rect(multipleFiveX(.75),multipleFiveY(.16),multipleFiveX(.03),multipleFiveX(.03));
		var triangle = s.polygon(multipleFiveX(.56),multipleFiveY(.22),multipleFiveX(.56),multipleFiveY(.11),multipleFiveX(.68),multipleFiveY(.12));
	
	}
	
	var leftPlatform = s.rect(multipleFiveX(.083), multipleFiveY(.25), multipleFiveX(.133), multipleFiveY(.59));
	var rightPlatform = s.rect(multipleFiveX(.46), multipleFiveY(.7), multipleFiveX(.45), multipleFiveX(.083));

	// bound of platforms
	var LEFT_TOP = leftPlatform.node.getBoundingClientRect().top;
	var LEFT_BOTTOM = leftPlatform.node.getBoundingClientRect().bottom;
	var LEFT_LEFT = leftPlatform.node.getBoundingClientRect().left;
	var LEFT_RIGHT = leftPlatform.node.getBoundingClientRect().right;

	var RIGHT_TOP = rightPlatform.node.getBoundingClientRect().top;
	var RIGHT_BOTTOM = rightPlatform.node.getBoundingClientRect().bottom;
	var RIGHT_LEFT = rightPlatform.node.getBoundingClientRect().left;
	var RIGHT_RIGHT = rightPlatform.node.getBoundingClientRect().right;

	// set speed of animations --> 1000 = 1s
	var SPEED = 10;



	// set element attributes
	circle.attr({
		//fill: 'url(#red_circle)',
		fill: 'red',
		opacity: '.7',
		position: '',
		class: 'moveable',
		id: 'circle'
	});

	rect.attr({
		//fill: 'url(#blue_rect)',
		fill: 'blue',
		opacity: '.7',
		position: '',
		class: 'moveable',
		id: 'rect'
	});

	square.attr({
		//fill: 'url(#green_square)',
		fill: 'green',
		opacity: '.7',
		position: '',
		class: 'moveable',
		id: 'square'
	});

	triangle.attr({
		//fill: 'url(#yellow_triangle)',
		fill: 'yellow',
		opacity: '.7',
		position: '',
		class: 'moveable',
		id: 'triangle'
	});

	leftPlatform.attr({
		fill: 'url(#left_platform)',
		id: 'leftPlatform'
	})

	rightPlatform.attr({
		fill: 'url(#right_platform)',
		id: 'rightPlatform'
	})


	// start each shape when it is clicked	
	$('.moveable').click(function(){
		id = this.id.substr(0, this.id.length);
		if (id == 'circle') {
			start(circle);
		}

		else if (id == 'rect') {
			start(rect);
		}

		else if (id == 'square') {
			start(square);
		}

		else if (id == 'triangle') {
			start(triangle);
		}
	});


	// starts the shape in motion - assigns directions randomly and calles moveAndCheck
	function start(shape) {
		var x = shape.getBBox().x;
		var y = shape.getBBox().y;
		var dx;
		var dy;

		// randomly assign a positive or negative value to the change in x or y
		if(Math.random() > .5) {
			dy = 5;
		}

		else {
			dy = -5;
		}

		if (Math.random() > .5) {
			dx = 5;
		}

		else {
			dx = -5;
		}

		
		moveAndCheck(shape, x, y, dx, dy);
	}	
	

	// parent function of the actual moving repeated function
	function moveAndCheck(shape, x, y, dx, dy) {
		// variables to keep track of the total distances moved
		// --> transform either only transforms from the original
		// location or it doesn't actually update the values of the element,
		// just the appearance. So the amount moved must increase by 
		// the amount you want it moved every time
		var totalDx = dx;
		var totalDy = dy;
		// infintely repeated interval function to actually do the moving
		var translateAndCheck = setInterval(function() {
			var x = Math.round(shape.getBBox().x);
			var y = shape.getBBox().y;
			// respond to collisions to as to avoid the same one again immediately
			if (colliding(shape, x, y)) {
				if (shape.position == 'lefttop' || shape.position == 'righttop' ||
					shape.position == 'bottomwall') {
					dy = -5;
					totalDy += -5;
				}
		
				else if(shape.position == 'leftleft' || shape.position == 'rightleft' ||
					shape.position == 'rightwall') {
					dx = -5;
					totalDx += -5;
				}
		
				else if(shape.position == 'leftright' || shape.position == 'rightright' ||
					shape.position == 'leftwall') {
					dx = 5;
					totalDx += 5;
				}
		
				else if (shape.position == 'leftbottom' || shape.position == 'rightbottom' ||
					shape.position == 'topwall') {
					dy = 5;
					totalDy += 5;
				}
			}
			
			shape.transform('t' + (totalDx) + ',' + (totalDy) + 's');
			totalDx += dx;
			totalDy += dy;
			
		}, SPEED);
	}



	// checks for collisions on each 8 sides of the two platforms ==> within 10 units of edges
	// sets the position attribute on the shape to reflect where it is
	function colliding(shape, x, y) {
		var height = Math.round(shape.getBBox().height / 5) *5;
		var width = Math.round(shape.getBBox().width / 5) * 5;

		if ((x == LEFT_LEFT - width) && (y >= LEFT_TOP && y <= LEFT_BOTTOM)) {
			shape.position = "leftleft";
			return true;
		}
		else if((x == LEFT_RIGHT) && (y >= LEFT_TOP && y <= LEFT_BOTTOM)) {
			shape.position = "leftright";
			return true;
		}
		else if ((y == LEFT_TOP - height) && (x >= LEFT_LEFT && x <= LEFT_RIGHT)) {
			shape.position = "lefttop";
			return true;
		}
		else if ((y == LEFT_BOTTOM) && (x >= LEFT_LEFT && x <= LEFT_RIGHT)) {
			shape.position = "leftbottom";
			return true;
		}
		else if ((x == RIGHT_LEFT - width) && (y >= RIGHT_TOP && y <= RIGHT_BOTTOM)) {
			shape.position = "rightleft";
			return true;
		}
		else if ((x == RIGHT_RIGHT) && (y >= RIGHT_TOP && y <= RIGHT_BOTTOM)) {
			shape.position = "rightright";
			return true;
		}
		else if ((y == RIGHT_TOP - height) && (x >= RIGHT_LEFT - width && x <= RIGHT_RIGHT + width)) {
			shape.position = "righttop";
			return true;
		}
		else if ((y == RIGHT_BOTTOM) && (x >= RIGHT_LEFT && x <= RIGHT_RIGHT)) {
			shape.position = "rightbottom";
			return true;
		}
		else if (x <= 0) {
			shape.position = "leftwall";
			return true;
		}
		else if (x >= WIDTH - width) {
			shape.position = "rightwall";
			return true;
		}
		else if (y <= 0) {
			shape.position = "topwall";
			return true;
		}

		else if (y >= HEIGHT - height) {
			shape.position = "bottomwall";
			return true;
		}

		else if ((x >= LEFT_LEFT && x <= LEFT_RIGHT && y >= LEFT_TOP && y <= LEFT_BOTTOM) ||
			(x >= RIGHT_LEFT && x <= RIGHT_RIGHT && y >= RIGHT_TOP && y <= RIGHT_BOTTOM)) {
			if ((x >= LEFT_RIGHT - 20 && x <= LEFT_RIGHT + 20) || (x >= RIGHT_RIGHT - 20 && x <= RIGHT_RIGHT + 20)) {
				shape.position = "leftwall"
			}
			else {
				shape.position = "rightwall";
			}
			return true;
			}

		else {
			return false;
		}
	}

	// takes a percent for the y value in relation to browser window
	// and returns the nearest multiple of 5
	function multipleFiveY(percent) {
		return Math.round(HEIGHT * percent / 5) * 5;
	}

	// takes a percent for the x value in relation to browser window
	// and returns the nearest multiple of 5
	function multipleFiveX(percent) {
		return Math.round(WIDTH * percent / 5) * 5;
	}


	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}



	// toggle about display
	function toggleAbout() {
		var about = $('#about');
	  	var svg = $('#svg');
		
	  	if (aboutVisible == false){
	  	  svg.css('opacity', '.5');
	  	  about.css('display', 'block');
	  	}
		
	  	else {
	  	  svg.css('opacity', '1');
	  	  about.css('display', 'none');
	  	}
	  	aboutVisible = !aboutVisible;
	}

	aboutLink.click(function() {
	  	toggleAbout();
	});

	closeBtn.click(function() {
		toggleAbout();
	});

});