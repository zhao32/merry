import GameTools from "./GameTools";

const _reduceTime = .1;//缩放耗时
const _touchInterval = 150;//点击间隔
const _clickMusic = 'sound/click';//触摸声效

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property
    pressedScale: number = 1.1

    start() {
        var self = this;

        var scaleX = self.node.scaleX > 0 ? self.pressedScale : -self.pressedScale
        var scaleY = self.node.scaleY > 0 ? self.pressedScale : -self.pressedScale
        let scaleDownAction = cc.scaleTo(_reduceTime, scaleX, scaleY);

        let lastClickTime = cc.sys.now();
        let initScaleX, initScaleY
        function onTouchDown(event) {
            var nowTime = cc.sys.now();
            var detal = nowTime - lastClickTime;
            if (detal < _touchInterval) {
                return false;
            } else {
                lastClickTime = nowTime;
                if (!initScaleX) {
                    initScaleX = self.node.scaleX;
                    initScaleY = self.node.scaleY;
                };
                if (scaleDownAction) {
                    this.runAction(scaleDownAction);
                };

                // GameTools.loadSound(_clickMusic, 1, false)
            };
        };
        function onTouchUp(event) {
            if (initScaleX && scaleDownAction) {
                this.stopAction(scaleDownAction)
                this.runAction(cc.scaleTo(_reduceTime, initScaleX, initScaleY));
            };
        };
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    }
}

