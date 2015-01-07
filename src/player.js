/*
 * player.js
 */

(function(np) {
    
    var KEY_LEFT  = 37;
    var KEY_UP    = 38;
    var KEY_RIGHT = 39;
    var KEY_B     = 66;
    
    var keyboard = [];
    var isKey = function(key){ return keyboard[key]; };
    document.addEventListener("keydown", function(e){
        keyboard[e.keyCode] = true;
    });
    document.addEventListener("keyup", function(e){
        keyboard[e.keyCode] = false;
    });


    var MARIO_BITMAP_WIDTH = 12;
    var MARIO_BITMAP_HEIGHT= 16;

    var colorList = [
        [0, 0, 0, 0],   // 透明
        [0xdc, 0x29, 0, 0xff],   // 赤
        [0xff, 0xa5, 0x3b, 0xff], // 肌
        [32, 32, 32, 0xff]   // 茶色
    ];
    
    var MARIO_BITMAP = [
		0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0,
		0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
		0, 0, 3, 3, 3, 2, 2, 3, 2, 0, 0, 0,
		0, 3, 2, 3, 2, 2, 2, 3, 2, 2, 2, 0,
		0, 3, 2, 3, 3, 2, 2, 2, 3, 2, 2, 2,
		0, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 0,
		0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0,
		0, 0, 3, 3, 1, 3, 3, 3, 0, 0, 0, 0,
		0, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 0,
		3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3,
		2, 2, 3, 1, 2, 1, 1, 2, 1, 3, 2, 2,
		2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2,
		2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2,
		0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0,
		0, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 0,
		3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3,
    ];

    var _Mario = np.Mario.createClass({
        superClass: np.Mario.Element,

        init: function(param) {
            param = param || {};
            for (var key in np.Mario.defaults) {
                if (!param[key]) {
                    param[key] = np.Mario.defaults[key];
                }
            }

            np.Mario.Element.call(this, param);

            this._setupMario(param);
            this.floorHeight = param.floorHeight;
            this.jumpValue = 0;
            this.setDirection(param.direction);
            this.enableJump = false;

            // update
            setInterval(this._update.bind(this), 1000.0/30);
        },

        _setupMario: function(param) {
            this.setX(param.x);
            this.setY(param.y || -50);

            this.element.addEventListener('click', function() {
                this.jump();
            }.bind(this));

            var setBitmap = function(){
                var tempCanvas = document.createElement("canvas");
                tempCanvas.width = MARIO_BITMAP_WIDTH;
                tempCanvas.height= MARIO_BITMAP_HEIGHT;
                var tempContext = tempCanvas.getContext("2d");
                var imageData = tempContext.createImageData(MARIO_BITMAP_WIDTH, MARIO_BITMAP_HEIGHT);
                
                for (var i=0; i<MARIO_BITMAP_WIDTH*MARIO_BITMAP_HEIGHT; ++i) {
                    var colorIndex = MARIO_BITMAP[i];
                    var color = colorList[colorIndex];
                    imageData.data[i*4 + 0] = color[0];
                    imageData.data[i*4 + 1] = color[1];
                    imageData.data[i*4 + 2] = color[2];
                    imageData.data[i*4 + 3] = color[3];
                }
                tempContext.putImageData(imageData, 0, 0);
                
                var context = this.element.getContext("2d");

                context.imageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.mozImageSmoothingEnabled = false;

                context.drawImage(tempCanvas, 0, 0, MARIO_BITMAP_WIDTH, MARIO_BITMAP_HEIGHT, 0, 0, this.element.width, this.element.height);
            }.bind(this);

            setBitmap();

        },

        setDirection: function(direction) {
            var style = this.element.style;
            if (direction == "left") {
                style.webkitTransform = "scaleX(-1)";
                style.MozTransform = "scaleX(-1)";
            }
            else {
                style.webkitTransform= "scaleX( 1)";
                style.MozTransform   = "scaleX( 1)";
            }
        },

        getFloor: function() {
            return window.innerHeight - this.floorHeight - this.element.height;
        },

        _update: function() {
            var x = this.getX();
            var y = this.getY();
            var vx = 0;
            var vy = 0;
            var floor = this.getFloor();
            var speed = (isKey(KEY_B)) ? 4:2; // check B dash

            // move left or right
            if (isKey(KEY_LEFT)) {
            	vx = -5*speed;
                this.setDirection("left");
            }
            if (isKey(KEY_RIGHT)) {
            	vx = 5*speed;
                this.setDirection("right");
            }

            // warp
            if (this.getRight() < 0) {
                this.setX(window.innerWidth);
                vx = 0;
            }
            else if (x > window.innerWidth) {
                this.setX(0);
                vx = 0;
            }

            // ジャンプ判定
            if (this.enableJump) {
                if (isKey(KEY_UP)) {
                    this.jump();
                    this.enableJump = false;
                }
            }

            // jump
            this.jumpValue += 1.5;
            vy = this.jumpValue;

            // collision
            var block = this._checkBlocks(vx, vy);
            if (block) {
            	var dx = (x+vx)-block.getX();
            	var dy = (y+vy)-block.getY();

            	if (Math.abs(dx) > Math.abs(dy)) {
            		if (dx < 0) {
		                this.setX(block.getX()-this.getWidth()-1);
            		}
            		else {
		                this.setX(block.getRight()+1);
            		}
	                vx = 0;
            	}
            	else {
            		if (dy < 0) {
		                this.setY(block.getY()-this.getHeight());
	            		this.enableJump = true;
            		}
            		else {
		                this.setY(block.getBottom());
		                block.gotoPage();
            		}
            		this.jumpValue = 0;
            		vy = 0;
            	}
            }

            // check bottom
            if ((y+vy) >= floor) {
            	vy = 0;
        		this.enableJump = true;
                this.jumpValue = 0;
            	this.setY(floor);
            }

            // move
            if (vx != 0) { this.setX(x+vx); }
            if (vy != 0) { this.setY(y+vy); }
        },

        _updateJump: function() {

        },

        _checkBlocks: function(vx, vy) {
            var self = this;
            var marioX = this.getX() + vx;
            var marioY = this.getY() + vy;
            var marioW = this.getWidth();
            var marioH = this.getHeight();
            var marioRight = marioX + marioW;
            var marioBottom = marioY + marioH;
            var blocks = np.Mario.blocks;
            var target = null;

            blocks.some(function(block) {
                var blockX = block.getX();
                var blockY = block.getY();
                var blockW = block.getWidth();
                var blockH = block.getHeight();

                if (blockX <= marioRight && marioX <= (blockX+blockW)) {
                    if (marioBottom > blockY && marioY < (blockY+blockH)) {
                        target = block;
                        return true;
                    }
                }
            });

            return target;
        },

        jump: function() {
            this.jumpValue = -28;
        },

    });

    np.Mario.Player = function(param) {
        return new _Mario(param);
    };


})(this);


