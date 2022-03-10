// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { State } from "../hero";
import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
import operateUI from "./operateUI";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    weChat: cc.Node = null
    // @property(cc.Node)
    weChatLeft: cc.Node = null;
    weChatCenter: cc.Node = null;

    // @property(cc.Node)
    weChatRight: cc.Node = null;

    @property({ type: cc.Prefab })
    foodPfb: cc.Prefab = null;

    _foodNum = 50

    foodList = []

    callback: any

    initFood() {
        console.log('初始化食物')
        let i = 0
        this.schedule(() => {
            let food = cc.instantiate(this.foodPfb)
            this.node.addChild(food)
            food.setPosition(400 + Math.random() * 634, 500)
            this.foodList.push(food)
            cc.tween(food)
                .to(1.5, { y: -200 }, { easing: 'cubicIn' })
                .call(() => { this.touchGround(); })
                .start()
        }, 1.5 - i * 20)
    }

    destoryFood() {
        while (this.foodList.length > 0) {
            let node = this.foodList.pop()
            if (node) node.destroy()
            console.log('删除食物')
        }
    }

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        gameContext.hasFllow = false
        EventMgr.getInstance().registerListener(EventMgr.FOODGROUND, this, this.touchGround.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.FOODGPLAYER, this, this.touchPlayer.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))

        this.weChat = this.node.getChildByName('weChat')
        this.weChatLeft = this.weChat.getChildByName('weChatLeft')
        this.weChatRight = this.weChat.getChildByName('weChatRight')
        this.weChatCenter = this.weChat.getChildByName('weChatCenter')

    }


    start() {
        this.Restart()
    }

    onDisable() {
        console.log('------------------第4关注销监听------------------')
        // EventMgr.getInstance().unRegisterListener(EventMgr.FOODGROUND, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.FOODGPLAYER, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        this.unscheduleAllCallbacks()
        this.destoryFood()
        GameTools.destroyNode(this.node)
    }



    Restart() {
        this.unscheduleAllCallbacks()
        gameContext.moveType = 0
        gameConfig.currLevel = 5
        this.weChat.active = false
        this.weChatLeft.active = false
        this.weChatRight.active = false
        this.weChatCenter.active = false

        gameContext.playerNode.active = true
        gameContext.playerNode.setPosition(100, -165);
        gameContext.player.state = State.standRight
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            this.weChat.active = true
        }, 1)
        this.scheduleOnce(() => {
            this.weChatLeft.active = true
            console.log('播放音效')
            GameTools.loadSound('sound/level/wechat0', 1, false)
        }, preTime + 1)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.weChatRight.active = true
            console.log('播放音效')
            GameTools.loadSound('sound/level/wechat1', 1, false)
        }, preTime + 4)

        this.scheduleOnce(() => {
            this.weChatLeft.active = false
            this.weChatRight.active = false
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                left: true,
                right: true,
                top: false,
                down: false,
                fight: false,
                jump: false
            });

            this.initFood()
            this.weChat.active = false

        }, preTime + 7)
    }

    touchGround() {
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -1 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san <= 0) {
            // gameContext.showToast('叔叔我吃不下了')
            this.weChat.active = true
            this.weChatCenter.active = true
            GameTools.loadSound('sound/level/wechat0', 1, false)
            GameTools.loadSound('sound/level/6/finish', 5, false)

            console.log('游戏结束')
            this.unscheduleAllCallbacks()
            gameContext.playerNode.active = false
            this.destoryFood()

            gameConfig.maxLevel = 6
            gameConfig.memoryLength = 6
            gameConfig.currMemory = 6
            EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {})
            this.scheduleOnce(() => {
                cc.director.loadScene("startScene", () => {
                    gameContext.showMemoryUI(true)
                });
            }, 2)

        }

        GameTools.loadSound('sound/level/6/touchground', 1, false)
    }

    touchPlayer(self: this, params) {
        gameContext.player.state = State.eat
        GameTools.loadSound('sound/level/6/eatfood', 1, false)
    }


    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()
    }

    // setSyncPosition() {
    //     let bodys = this.node.getComponentsInChildren(cc.RigidBody)
    //     for (let i = 0; i < bodys.length; i++) {
    //         bodys[i].syncPosition(true)
    //     }
    // }
}
