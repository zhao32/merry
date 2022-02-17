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


    // weChat: cc.Node = null
    // // @property(cc.Node)
    // weChatLeft: cc.Node = null;

    // // @property(cc.Node)
    // weChatRight: cc.Node = null;

    @property
    text: string = 'hello';

    callback: any

    page0: cc.Node
    page1: cc.Node
    label0: cc.Label
    label1: cc.Label

    hp: cc.Node
    hpNum: number

    tank: cc.Node
    arm: cc.Node

    _touchSheep:boolean



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
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHTANKARM, this, this.touchArm.bind(this))

        this.scheduleOnce(() => {
            console.log('第六关 发送OPERATEBTNRESET')
            EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        }, 0.1)
        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')
        this.page0.active = true
        this.page1.active = false

        this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)
        this.label0.string = ''
        this.label1.string = ''

        this.hp = this.page1.getChildByName('hp')
        this.tank = this.page1.getChildByName('tank')
        this.arm = this.page1.getChildByName('arm')
        this.arm.opacity = 0

        this.tank.x = 60

        this.hpNum = 10

        gameContext.playerNode.active = false
        this._touchSheep = false
        this.schedule(this.tankMove, 10)
        this.armAttack()
    }


    start() {
        this.Restart()
        this.preStart()
    }

    Restart() {
        this.page0.active = true
        this.page1.active = false
        this.hpNum = 10

        gameConfig.currLevel = 6
        gameContext.playerNode.setPosition(100, -165)
        gameContext.playerNode.active = false
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            // this.weChatLeft.active = true
            // console.log('播放音效')
            this.label0.string = '【猴】:装修太累了吧！'
        }, preTime)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.page0.runAction(cc.sequence(cc.fadeOut(2), cc.callFunc(() => {
                EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});
                EventMgr.getInstance().sendListener(EventMgr.OPERATEBTNRESET, { left: true, right: true, top: false, down: false, fight: false, jump: true });
                gameContext.playerNode.active = true
                this.page1.active = true
            })))

        }, preTime + 2)

    }

    touchFood(self: this, params) {

    }

    touchArm() {
        console.log('手臂攻击')
        if (this.arm.opacity == 255) {
            this.arm.opacity = 254
            EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -2 });
            let operateUI: operateUI = gameContext.operateUI
            if (operateUI.san <= 1) {
                operateUI.san = 9
                gameContext.showToast('鼠鼠会在暗中支持你！')
            }
        }
    }

    tankMove() {
        let list = [1, 2, 3, -1, -2, -3]
        let ids = list[Math.floor(Math.random() * list.length)] * 220

        let move0 = cc.moveBy(2, new cc.Vec2(ids, 0))
        let delay = cc.delayTime(1)
        let move2 = cc.moveBy(2, new cc.Vec2(-ids, 0))
        // this.arm.getComponent(cc.RigidBody).syncPosition(true)
        let ani0 = cc.sequence(move0, delay, move2)
        let ani1 = ani0.clone()
        this.tank.runAction(ani0)
        this.arm.runAction(ani1)
    }

    armAttack() {
        let callF0 = cc.callFunc(() => {
            this.arm.opacity = 255
        })

        let delay0 = cc.delayTime(2)
        let delay1 = cc.delayTime(1)

        let callF1 = cc.callFunc(() => {
            this.arm.opacity = 0
        })
        this.node.runAction(cc.repeatForever(cc.sequence(delay0, callF0, delay1, callF1)))
    }


    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()


        let armPos = this.page1.convertToWorldSpaceAR(this.arm.getPosition())
        // console.log('heroX:'+ gameContext.playerNode.x)
        // console.log('sheepX:'+ sheepPos.x)
        // console.log('heroY:'+ gameContext.playerNode.y)
        // console.log('sheepY:'+ sheepPos.y)
        if (this._touchSheep == false && Math.abs(armPos.x - gameContext.playerNode.x) < 100 ) {
          
        }
    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
