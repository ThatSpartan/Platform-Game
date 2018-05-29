var canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 300;
document.body.appendChild(canvas);

var context = canvas.getContext('2d');

let controller = {

    up : false,
    right : false,
    left : false,

    KeyPressed : (event) => {

        let key_state = (event.type == 'keydown') ? true : false;

		switch (event.keyCode) {

			case 65: // left key
				controller.left = key_state;
				break;

			case 87: // up key
				controller.up = key_state;
				break;

			case 68: // right key
				controller.right = key_state;
				break;

		}

    },

};

let player = {

    x : 0,
    y : 0,

    x_velocity : 0,
    y_velocity : 0,

    jumping : true,

};

function main_loop() {

    if (controller.left) { player.x_velocity -= 0.5; }
	if (controller.up && !player.jumping) { player.y_velocity -= 20; player.jumping = true; }
    if (controller.right) { player.x_velocity += 0.5; }

    player.x += player.x_velocity;
    player.x_velocity *= 0.9;

    // add grabity
    player.y_velocity += 1.5;

    player.y += player.y_velocity;
    player.y_velocity *= 0.9;

    if (player.y > 300 - 30) {

        player.jumping = false;
        player.y = 300 - 30;
        player.y_velocity = 0;

    }

    if (player.x > 600) { player.x = -30; }
    if (player.x < -30) { player.x = 600; }

    context.fillStyle = 'rgba(255, 220, 120, 0.4)';
    context.fillRect(0, 0, 600, 300);

    context.fillStyle = '#ff00c3';
    context.fillRect(player.x, player.y, 30, 30);

    window.requestAnimationFrame(main_loop);

}



window.addEventListener('keydown', controller.KeyPressed);
window.addEventListener('keyup', controller.KeyPressed);
window.requestAnimationFrame(main_loop);