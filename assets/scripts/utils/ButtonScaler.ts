import GameTools from "./GameTools";

const _reduceTime = .1;//缩放耗时
const _touchInterval = 150;//点击间隔
const _clickMusic = 'sound/click';//触摸声效
cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 1.1
    },
    start() {
        var self = this;
        self.button = self.getComponent(cc.Button);

        var scaleX = self.node.scaleX > 0 ? self.pressedScale : -self.pressedScale
        var scaleY = self.node.scaleY > 0 ? self.pressedScale : -self.pressedScale
        self.scaleDownAction = cc.scaleTo(_reduceTime, scaleX, scaleY);

        this.lastClickTime = cc.sys.now();
        function onTouchDown(event) {
            var nowTime = cc.sys.now();
            var detal = nowTime - self.lastClickTime;
            if (detal < _touchInterval) {
                return false;
            } else {
                self.lastClickTime = nowTime;
                if (!self.initScaleX) {
                    self.initScaleX = self.node.scaleX;
                    self.initScaleY = self.node.scaleY;
                };
                if (self.scaleDownAction) {
                    this.runAction(self.scaleDownAction);
                };

                GameTools.loadSound(_clickMusic, 1, false)
            };
        };
        function onTouchUp(event) {
            if (self.initScaleX && self.scaleDownAction) {
                this.stopAction(self.scaleDownAction)
                this.runAction(cc.scaleTo(_reduceTime, self.initScaleX, self.initScaleY));
            };
        };
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    },
});
