// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";
import operateUI from "./operateUI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property
    text: string = 'hello';

    callback: any

    role0: cc.Node

    page0: cc.Node
    page1: cc.Node

    wave0: cc.Node
    wave1: cc.Node




    init(data: any, callback) {
        this.callback = callback
        // this.Restart()
        // this.preStart()
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()
        // gameContext.currLevelScript = this.node.getComponent('level0')
        EventMgr.getInstance().registerListener(EventMgr.TOUCHBAT, this, this.touchBat.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHWAVE, this, this.touchWave.bind(this))

        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')
        this.role0 = this.page0.getChildByName('role0')
        this.wave0 = this.page1.getChildByName('wave0')
        this.wave1 = this.page1.getChildByName('wave1')

        this.page0.active = true
        this.page1.active = false
    }


    start() {
        this.Restart()
        this.preStart()
    }

    touchBat() {

    }

    touchWave() {
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -3 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 1) {
            operateUI.san = 9
            gameContext.showToast('鼠鼠会在暗中支持你！')
        }
    }



    Restart() {
        // gameConfig.currLevel = 1
        // gameConfig.maxLevel = 1

        gameContext.playerNode.setPosition(100, -165)
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            this.role0.scale = 1.5
            let roleAni = this.role0.getComponent(cc.Animation)
                .play('walkRight').repeatCount = Infinity
            let moveBy = cc.moveBy(6, new cc.Vec2(900, 0));
            let callF = cc.callFunc(() => {
                EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});
                this.page0.active = false
                this.page1.active = true
                this.showWave()
            });
            this.role0.runAction(cc.sequence(moveBy, callF))

        }, preTime + 1)
    }

    touchFood(self: this, params) {
    }

    showWave() {
        // this.wave.runAction()
        this.wave0.active = false
        this.wave1.active = false

        let delay0 = cc.delayTime(3)
        let callF0 = cc.callFunc(() => {

            let random = Math.random() * 1
            if (random > 0.5) {
                this.wave0.active = true
                this.wave1.active = false
            } else {
                this.wave0.active = false
                this.wave1.active = true
            }
        })
        let delay1 = cc.delayTime(1)
        let callF1 = cc.callFunc(() => {
            this.wave0.active = false
            this.wave1.active = false
        })
        this.node.runAction(cc.repeatForever(cc.sequence(delay0, callF0, delay1, callF1)))
    }

    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()
    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
