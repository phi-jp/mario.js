/*
 * Mario
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

    
    var MARIO_BITMAP_WIDTH = 14;
    var MARIO_BITMAP_HEIGHT= 18;

    var colorList = [
        [0, 0, 0, 0],   // 透明
        [0xdc, 0x29, 0, 0xff],   // 赤
        [0xff, 0xa5, 0x3b, 0xff], // 肌
        [32, 32, 32, 0xff]   // 茶色
    ];
    
    var MARIO_BITMAP = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0,
        0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0,
        0, 0, 0, 3, 3, 3, 2, 2, 3, 2, 0, 0, 0, 0,
        0, 0, 3, 2, 3, 2, 2, 2, 3, 2, 2, 2, 0, 0,
        0, 0, 3, 2, 3, 3, 2, 2, 2, 3, 2, 2, 2, 0,
        0, 0, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 0, 0,
        0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0,
        0, 0, 0, 3, 3, 1, 3, 3, 3, 0, 0, 0, 0, 0,
        0, 0, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 0, 0,
        0, 3, 3, 3, 3, 1, 3, 3, 1, 3, 3, 3, 3, 0,
        0, 2, 2, 3, 1, 2, 1, 1, 2, 1, 3, 2, 2, 0,
        0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 2, 2, 2, 0,
        0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 0,
        0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0,
        0, 0, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 0, 0,
        0, 3, 3, 3, 3, 0, 0, 0, 0, 3, 3, 3, 3, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

    np.Mario = function(param)
    {
        var mario = new _Mario(param);
        return mario;
    };
    np.Mario.blocks = [];
    np.Mario.defaults = {
        x: 50,
        y: -50,
        scale: 2,
        floorHeight: 50,
        direction: "right",
    };


    var _Mario = function(param) {
        this.init(param);
    };

    _Mario.prototype = {
        init: function(param) {
            param = param || {};
            for (var key in np.Mario.defaults) {
                if (!param[key]) {
                    param[key] = np.Mario.defaults[key];
                }
            }

            this._setupMario(param);
            this.floorHeight = param.floorHeight;
            this.jumpValue = 0;
            this.setDirection(param.direction);

            // update
            setInterval(this._update.bind(this), 1000.0/30);
        },

        _setupMario: function(param) {
            var scale = param.scale;
            var eMario = document.createElement("canvas");
            this.eMario = eMario;
            document.body.appendChild(eMario);

            eMario.width = MARIO_BITMAP_WIDTH  * scale;
            eMario.height= MARIO_BITMAP_HEIGHT * scale;
            eMario.style.position = "fixed";
            eMario.style.margin = "0";
            eMario.style.padding = "0";
            eMario.style.zIndex = "0";

            this.setX(param.x);
            this.setY(param.y || -50);

            eMario.addEventListener('click', function() {
                console.log("hoge");
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
                
                var context = eMario.getContext("2d");

                context.imageSmoothingEnabled = false;
                context.webkitImageSmoothingEnabled = false;
                context.mozImageSmoothingEnabled = false;

                context.drawImage(tempCanvas, 0, 0, MARIO_BITMAP_WIDTH, MARIO_BITMAP_HEIGHT, 0, 0, eMario.width, eMario.height);
            };
            setBitmap();

        },

        getX: function() {
            return  Number( this.eMario.style.left.replace("px", '') );
        },
        setX: function(v) {
            this.eMario.style.left = v + 'px';
        },
        getY: function() {
            return  Number( this.eMario.style.top.replace("px", '') );
        },
        setY: function(v) {
            this.eMario.style.top = v + 'px';
        },
        getWidth: function() {
            return Number(this.eMario.width);
        },
        getHeight: function() {
            return Number(this.eMario.height);
        },

        setDirection: function(direction) {
            var style = this.eMario.style;
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
            return window.innerHeight - this.floorHeight - this.eMario.height;
        },

        _update: function() {
            var x = this.getX();
            var y = this.getY();
            var floor = this.getFloor();
            
            // check B dash
            var speed = (isKey(KEY_B)) ? 2:1;
            // move
            if (isKey(KEY_LEFT)) {
                x-=5*speed;
                this.setDirection("left");
            }
            if (isKey(KEY_RIGHT)) {
                x+=5*speed;
                this.setDirection("right");
            }
            // warp
            if (x < 0) { x=window.innerWidth; }
            if (x > window.innerWidth) { x=0; }


            // jump
            if (y == floor && isKey(KEY_UP)) this.jump();
            this.jumpValue += 0.5;
            y += this.jumpValue;
            // check bottom
            if (y >= floor) {
                y = floor;
                this.jumpValue = 0;
            }

            // 衝突判定
            var hit = this._checkBlocks();
            if (hit == true) {
                y = window.innerHeight-150-this.getHeight();
            }

            // set position

            this.setX(x);
            this.setY(y);
        },

        _checkBlocks: function() {
            var self = this;
            var marioX = this.getX();
            var marioY = this.getY();
            var marioW = this.getWidth();
            var marioH = this.getHeight();
            var marioBottom = marioY + marioH;
            var blocks = np.Mario.blocks;

            return blocks.some(function(block) {
                var blockX = block.getX();
                var blockY = block.getY();

                if (marioBottom > blockY) {
                    self.setY(blockY-marioH);
                    console.log(blockY-marioH);
                    self.jumpValue = 0;
                    return true;
                }
            });
        },

        jump: function() {
            this.jumpValue = -16;
        },

    };

    var Block = function(param) {
        this.init(param);
    };

    Block.prototype = {
        init: function(param) {
            this.element = document.createElement("img");

            var element = this.element;
            document.body.appendChild(element);

            element.src = param.src;

            element.width = param.width;
            element.height= param.height;
            element.style.position = "fixed";
            element.style.margin = "0";
            element.style.padding = "0";
            element.style.zIndex = "0";

            this.setX(param.x);
            this.setY(param.y);

            np.Mario.blocks.push(this);
        },
        getX: function() {
            return  Number( this.element.style.left.replace("px", '') );
        },
        setX: function(v) {
            this.element.style.left = v + 'px';
        },
        getY: function() {
            return  Number( this.element.style.top.replace("px", '') );
        },
        setY: function(v) {
            this.element.style.top = v + 'px';
        },
        getWidth: function() {
            return Number(this.element.width);
        },
        getHeight: function() {
            return Number(this.element.height);
        },
    };

    np.Mario.Block = function(param) {
        return new Block(param);
    };
    
})(window);
