// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero from "../hero";
import { State } from "../rat";
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

    distance: number = null

    boat: cc.Node = null
    weChat: cc.Node = null
    Finish: cc.Node = null

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()

        EventMgr.getInstance().registerListener(EventMgr.TOUCHTHORNS, this, this.touchThorns.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHFINISH, this, this.touchFinish.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        this.initNode()
    }

    
    initNode() {
        this.boat = this.node.getChildByName('boat')
        this.weChat = this.node.getChildByName('weChat')
        this.weChat.active = false
        this.Finish = this.node.getChildByName('Finish')
    }

    preStart() {
        let move = cc.moveTo(4, new cc.Vec2(2200, -150))
        this.boat.runAction(cc.sequence(move, cc.callFunc(() => { this.boat.setPosition(115, 500) })))
        let self = this
        this.scheduleOnce(() => {
            self.weChat.active = true
            console.log('start weChat0：' + self.weChat)
        }, 2)

        this.scheduleOnce(() => {
            self.weChat.active = false
            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                left: true,
                right: true,
                top: false,
                down: false,
                fight: false,
                jump: true
            });

            console.log('start weChat1：' + self.weChat)

        }, 4)
    }

    start() {
        this.Restart()
    }

    update(dt) {
        if (gameContext.moveType == 1) {
            this.node.x -= gameContext.viewSpeed
            this.setSyncPosition()
            this.distance += gameContext.viewSpeed
        }

        if(this.node.x > 0){
            this.node.x = 0
            this.distance = 0
            this.setSyncPosition()
        }


        if (this.distance > 1334) {
            // gameContext.moveType = 0
            let operateUI: operateUI = gameContext.operateUI
            if (gameContext.moveType == 1) {
                gameContext.moveType = 0
                if ((gameContext.player as hero).state == State.walkRight) {
                    operateUI.startRight()
                } else if ((gameContext.player as hero).state == State.walkLeft) {
                    operateUI.startLeft()
                }
            }
        }
    }


    onDisable(){
        console.log('------------------第2关销毁------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHTHORNS, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHFINISH, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
    }


    Restart() {
        gameContext.hasFllow = false
        gameConfig.currLevel = 1
        this.distance = 0
        gameContext.moveType = 1
        this.node.setPosition(0, 0)
        gameContext.playerNode.active = true
        gameContext.playerNode.setPosition(300, -165);
        (gameContext.player as hero).state = State.standRight
        this.preStart()
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
    }

    touchThorns() {
        console.log('触碰荆棘')
        EventMgr.getInstance().sendListener(EventMgr.UPDATESAN, { 'disSan': -1 });
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI.san == 1) {
            operateUI.san = 9
            gameContext.showToast('老鼠需要猴子！')
        }
    }

    touchFinish() {
        console.log('达成通关')
        this.scheduleOnce(() => {
            console.log('游戏完成')
            // gameContext.showToast('进入记忆宝典')
            gameConfig.maxLevel = 2
            cc.director.loadScene("startScene",()=>{
                gameContext.memoryLength = 2
                gameContext.showMemoryUI()
            });           
        }, 1)
    }


    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
