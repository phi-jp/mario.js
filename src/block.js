/*
 * block.js
 */

(function(np) {

    var Block = np.Mario.createClass({
        superClass: np.Mario.Element,

        init: function(param) {
            param.tagName = "img";

            np.Mario.Element.call(this, param);

            this.element.src = param.src;
            this.element.style.borderRadius = "8px";
            this.element.style.border = param.border || "2px solid black";
            this.link = param.link;

            this.element.onclick = function() {
                this.openPage();
            }.bind(this);

            np.Mario.blocks.push(this);
        },

        openPage: function() {
            window.open(this.link);
        },

        gotoPage: function() {
            location.href = this.link;
        },

    });

    np.Mario._Block = Block;
    np.Mario.Block = function(param) {
        return new Block(param);
    };

})(this);



(function(np) {

    var TwitterBlock = np.Mario.createClass({
        superClass: np.Mario._Block,

        init: function(param) {
        	param.src = Mario.assets.twitter;

        	var url = "https://twitter.com/intent/tweet?text={title}&url={url}";
        	param.link = url.replace("{title}", param.title).replace("{url}", param.link);
        	param.border = "2px solid hsla(200, 50%, 50%, 1)";

            np.Mario._Block.call(this, param);
        },
    });

    np.Mario.TwitterBlock = function(param) {
        return new TwitterBlock(param);
    };

})(this);

(function(np) {

    var HatenaBlock = np.Mario.createClass({
        superClass: np.Mario._Block,

        init: function(param) {
            param.src = Mario.assets.hatebu;
            param.link = "http://b.hatena.ne.jp/entry/" + location.href.replace(/https?:\/\//, '');
            param.border = "2px solid rgb(65, 78, 145)";

            np.Mario._Block.call(this, param);
        },
    });

    np.Mario.HatenaBlock = function(param) {
        return new HatenaBlock(param);
    };

})(this);

(function(np) {

    var RssBlock = np.Mario.createClass({
        superClass: np.Mario._Block,

        init: function(param) {
            param.src = Mario.assets.rss;
            param.link = "/rss/";
            param.border = "2px solid hsl(40, 100%, 50%)";

            np.Mario._Block.call(this, param);
        },
    });

    np.Mario.RssBlock = function(param) {
        return new RssBlock(param);
    };

})(this);

(function(np) {

    var PocketBlock = np.Mario.createClass({
        superClass: np.Mario._Block,

        init: function(param) {
            param.src = Mario.assets.pocket;
            var euc = encodeURIComponent;
            var url = "https://getpocket.com/edit?url={url}";
            var link = param.link || location.href;
            param.link = url.replace("{url}", euc(link));
            param.border = "2px solid hsl(340, 90%, 50%)";

            np.Mario._Block.call(this, param);
        },
    });

    np.Mario.PocketBlock = function(param) {
        return new PocketBlock(param);
    };

})(this);
