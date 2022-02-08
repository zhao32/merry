const { ccclass, property } = cc._decorator;

@ccclass
export default class GameUI extends cc.Component {
    @property(cc.Label)
    label: cc.Label = null;
    msg: string = null
    showTime: number = null
    callback: Function = null

    start() {
        let self = this;
        this.label.string = this.msg || "";
        this.label.node.active = false;
        this.node.scaleX = 0;
        this.node.opacity = 50;
        var finished = cc.callFunc(function () {
            self.moveAction();
        }, this);
        var scaleAndMove = cc.sequence(cc.spawn(cc.fadeTo(0.2, 255), cc.scaleTo(0.2, 1, 1)), finished);
        this.node.runAction(scaleAndMove);
    }
    showToast(msg, showTime, callback) {
        this.msg = msg;
        this.showTime = showTime;
        this.callback = callback;
    }

    moveAction() {
        let self = this;
        this.label.node.active = true;
        var delayCallTime = cc.delayTime(this.showTime);
        var fadeOut = cc.fadeOut(1);
        var callFunc = cc.callFunc(() => {
            if (self.callback) {
                self.callback(self.node);
            }
            if (self.node) {
                self.node.destroy();
            }
        });
        this.node.runAction(cc.sequence(delayCallTime, fadeOut, callFunc));
    }
};
