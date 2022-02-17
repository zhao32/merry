// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;


    weChat: cc.Node = null
    // @property(cc.Node)
    weChatLeft: cc.Node = null;

    // @property(cc.Node)
    weChatRight: cc.Node = null;

    @property({ type: cc.Prefab })
    foodPfb: cc.Prefab = null;

    _foodNum = 50

    foodList = []

    @property
    text: string = 'hello';

    callback: any

    initFood() {
        console.log('初始化食物')
        this._foodNum = 30
        for (let i = 0; i < 20; i++) {
            this.scheduleOnce(() => {
                let food = cc.instantiate(this.foodPfb)
                this.node.addChild(food)
                food.setPosition(400 + Math.random() * 634, 500)
                this.foodList.push(food)
            }, 2 + 30 * (i / 30))
        }
    }



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
        EventMgr.getInstance().registerListener(EventMgr.TOUCHMASK, this, this.touchFood.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))


        this.weChat = this.node.getChildByName('weChat')
        this.weChatLeft = this.weChat.getChildByName('weChatLeft')
        this.weChatRight = this.weChat.getChildByName('weChatRight')

        this.scheduleOnce(() => {
            console.log('第四关 发送OPERATEBTNRESET')
            EventMgr.getInstance().sendListener(EventMgr.OPERATEBTNRESET, { left: true, right: true, top: false, down: false, fight: false, jump: false });
        }, 0.1)
    }


    start() {
        this.Restart()
        this.preStart()
    }




    Restart() {
        gameConfig.currLevel = 1
        gameConfig.maxLevel = 1
        this.weChatLeft.active = false

        this.weChatRight.active = false

        gameContext.playerNode.setPosition(100, -165)
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            this.weChatLeft.active = true
            console.log('播放音效')

        }, preTime + 1)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.weChatRight.active = true
            console.log('播放音效')

        }, preTime + 2)

        this.scheduleOnce(() => {
            this.weChatLeft.active = false
            this.weChatRight.active = false
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {});
            this.initFood()
        }, preTime + 4)
    }

    touchFood(self: this, params) {
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
