var canvas = document.createElement('canvas');
canvas.width = 600;
canvas.height = 300;
document.body.appendChild(canvas);

const fps = 5;

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

function collision(player, box) {
    
    if (player.top > box.bottom || player.right < box.left || player.bottom < box.top || player.left > box.right) {
        
        return false;

    }

    return true;
    
}

function fix_collision(player, box) {
    
    let vector_x = player.center_x - box.center_x;
    let vector_y = player.center_y - box.center_y;
    let vector_old_y = player.center_old_y - box.center_old_y;

    if (vector_y * vector_y > vector_x * vector_x) {

        if (vector_y > 0) {

            console.log('collision');

        } else {

            console.log('collision');

            player.jumping = false;
            player.y = box.top - player.height;
            player.old_y = player.y;
            player.y_velocity = 0;

        }

    } else {

        if (vector_x > 0) {
            
            player.x = box.x + box.width;
            player.x_velocity = 0;

        } else {
            
            player.x = box.x - player.width;
            player.x_velocity = 0;

        }

    }

}

let player = {

    width : 30,
    height : 30,

    x : 0,
    y : 0,

    old_x : 0,
    old_y : 0,

    x_velocity : 0,
    y_velocity : 0,

    jumping : true,

    get center_x() { return this.x + this.width / 2; },
    get center_y() { return this.y + this.height / 2; },
    
    get center_old_y() { return this.old_y + this.height / 2; },

    get bottom() { return this.old_y + this.height; },
    get left() { return this.x; },
    get right() { return this.x + this.width; },
    get top() { return this.y; },

};

let boxes = [];

class box {

    constructor(width, height, x, y) {
        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;
    }

    get center_x() { return this.x + this.width / 2; }
    get center_y() { return this.y + this.height / 2; }

    get bottom() { return this.y + this.height; }
    get left() { return this.x; }
    get right() { return this.x + this.width; }
    get top() { return this.y; }

}

boxes.push(new box(60, 20, 200, 300-20));
boxes.push(new box(100, 15, 400, 300-15));

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

    // bottom of canvas
    if (player.y > 300 - 30) {

        player.jumping = false;
        player.old_y = player.y = 300 - 30;
        player.y_velocity = 0;

    }

    // sides of canvas
    if (player.x > 600 - 30) { player.x = 600 - 30; }
    if (player.x < 0) { player.x = 0; }

    const player_x = player.x;
    const player_y = player.y;
    const box_x = boxes[0].x;
    const box_y = boxes[0].y;
    const box_width = boxes[0].width;
    const player_size = 30;

    // box
    // if (player.y+30 > box_y && player.old_y+30 <= box_y && player.x > box_x && player.x+30 < box_x+box_width)
    // {
    //     player.jumping = false;
    //     player.y_velocity = 0;
    //     player.old_y = player.y = box_y - 30 - 0.01;
    // }

    // box tests
    // if (player_x+player_size > box_x && player_y+player_size > box_y)
    // {
    //     player.x = box_x - player_size - 0.001;
    //     player.x_velocity = 0;
    // }
    // if (player_y+player_size > box_y && player_x+player_size > box_x)
    // {
    //     player.y = box_y - player_size - 0.001;
    //     player.y_velocity = 0;
    // }

    // new box tests
    if (collision(player, boxes[0])) {
        fix_collision(player, boxes[0]);
    }
    if (collision(player, boxes[1])) {
        fix_collision(player, boxes[1]);
    }

    context.fillStyle = '#8f7bcd';
    context.fillRect(boxes[0].x, boxes[0].y, boxes[0].width, boxes[0].height);
    context.fillRect(boxes[1].x, boxes[1].y, boxes[1].width, boxes[1].height);

    context.fillStyle = 'rgba(255, 220, 120, 0.4)';
    context.fillRect(0, 0, 600, 300);

    context.fillStyle = '#d65861';
    context.fillRect(player.x, player.y, 30, 30);

    document.getElementById('player_x').innerHTML = 'player x : ' + player.x;
    document.getElementById('player_y').innerHTML = 'player y : ' + player.y;

    document.getElementById('player_old_x').innerHTML = 'player old x : ' + player.old_x;
    document.getElementById('player_old_y').innerHTML = 'player old y : ' + player.old_y;

    document.getElementById('box_x').innerHTML = 'box x : ' + box_x;
    document.getElementById('box_y').innerHTML = 'box y : ' + box_y;
    
    document.getElementById('box_x_width').innerHTML = 'box x + width : ' + (box_x + box_width);

    setTimeout(() => {
        window.requestAnimationFrame(main_loop);
    }, 1000 / fps);

}

window.addEventListener('keydown', controller.KeyPressed);
window.addEventListener('keyup', controller.KeyPressed);
window.requestAnimationFrame(main_loop);