// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
import hero, { State } from "../hero";
import { Logger } from "../Logger";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property({ type: cc.Prefab })
    foodPfb: cc.Prefab = null;

    @property
    text: string = 'hello';

    callback: any

    idX: number = 0
    couldList: cc.Node[] = []

    page0: cc.Node
    page1: cc.Node
    page2: cc.Node
    label0: cc.Node
    label1: cc.Node

    sheepMis: cc.Node
    water: cc.Node
    ratTear: cc.Node

    sheep: cc.Node
    _touchSheep: boolean = false

    hp: cc.Node
    hpNum: number

    init(data: any, callback) {
        this.callback = callback
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()
        gameContext.hasFllow = false

        EventMgr.getInstance().registerListener(EventMgr.TOUCHSHEEP, this, this.touchSheep.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});

        this.page0 = this.node.getChildByName('page0')
        this.page1 = this.node.getChildByName('page1')
        this.page2 = this.node.getChildByName('page2')

        this.label0 = this.page0.getChildByName('label0')
        this.label1 = this.page0.getChildByName('label1')

        this.hp = this.page1.getChildByName('hp')
        for (let i = 0; i < 4; i++) {
            let could = this.page1.getChildByName(`could${i}`)
            this.couldList.push(could)
        }

        this.sheep = this.page1.getChildByName('sheep')
        this.sheepMis = this.page2.getChildByName('sheep')
        this.ratTear = this.page2.getChildByName('tearRat')
        this.water = this.page2.getChildByName('water')
    }

    onDisable() {
        Logger.log('------------------???6???????????????------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHSHEEP, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        GameTools.destroyNode(this.node)
    }


    start() {
        this.Restart()
    }

    Restart() {
        this.unscheduleAllCallbacks()
        gameContext.moveType = 0
        this.page0.active = true
        this.page1.active = false
        this.page2.active = false
        this.label0.active = this.label1.active = false

        // this.label0.string = ''
        // this.label1.string = ''

        this.idX = 0
        this.hpNum = 10
        this._touchSheep = false
        this.sheep.setPosition(this.couldList[0].x, this.couldList[0].y + 60)

        this.sheepMis.y = -500
        this.water.height = 100
        this.ratTear.active = true

        gameConfig.currLevel = 4
        gameContext.playerNode.setPosition(200, -210)
        gameContext.playerNode.active = false
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.unscheduleAllCallbacks()
        this.sheep.stopAllActions()
        this.preStart()
    }

    /**???????????? */
    preStart() {
        let preTime = 1
        this.page0.getChildByName('talkbg').active = true
        this.scheduleOnce(() => {
            this.label0.active = true
            GameTools.loadSound('sound/level/wechat0', 1, false)
        }, preTime)
       
        this.scheduleOnce(() => {
            this.label1.active = true
            GameTools.loadSound('sound/level/wechat1', 1, false)
        }, preTime + 3)

        this.scheduleOnce(() => {
            this.label0.active = false
            this.label1.active = false
            this.page0.getChildByName('talkbg').active = false
            GameTools.loadSound('sound/level/5/hulu', 1, false)
        }, preTime + 6)

        this.scheduleOnce(() => {
            this.page0.active = false
            this.page1.active = true
            gameContext.playerNode.active = true
            gameContext.player.state = State.standRight;
            GameTools.loadSound('sound/level/5/sheepbgm', 0, true)

            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                left: true,
                right: true,
                top: false,
                down: false,
                fight: true,
                jump: true
            });

        }, preTime + 12)
    }

    fight() {
        this._touchSheep = false
        this.idX++
        let endPos = this.couldList[(this.idX) % this.couldList.length].getPosition()
        Logger.log('????????????')
        GameTools.loadSound('sound/level/5/sheepjump', 1, false)

        endPos.y += 60
        this.sheep.runAction(cc.sequence(cc.moveTo(1, endPos), cc.callFunc(() => { this._touchSheep = false })))
        this.hpNum--
        this.hp.scaleX = this.hpNum / 10
        if (this.hpNum == 7) {
            GameTools.loadSound('sound/level/5/hp7', 1, false)
        } else if (this.hpNum == 4) {
            GameTools.loadSound('sound/level/5/hp4', 1, false)
        } else if (this.hpNum == 1) {
            let endPos0 = this.couldList[1].getPosition()
            let endPos1 = this.couldList[2].getPosition()
            let endPos2 = this.couldList[3].getPosition()
            let endPos3 = new cc.Vec2(endPos2.x + 300,endPos2.y)

            let move0 = cc.moveTo(.5, endPos0)
            let move1 = cc.moveTo(.5, endPos1)
            let move2 = cc.moveTo(.5, endPos2)
            let move3 = cc.moveTo(.5, endPos3)

            this.sheep.runAction(cc.sequence(move0, move1, move2, move3, cc.callFunc(() => {
                Logger.log('????????????')
                this.page1.active = false
                gameContext.playerNode.active = false
                this.showOverPage()
            })))
        }

    }

    touchSheep() {
        Logger.log('gameContext.player.x:' + gameContext.playerNode.x)
        Logger.log('sheep.x:' + this.sheep.x)

        // if ((gameContext.player as hero).state != State.fight) return
        this._touchSheep = true


    }

    showOverPage() {

        GameTools.loadSound('sound/level/5/rattaer', 1, false)

        this.page2.active = true
        this.ratTear.active = true
        // cc.tween(this.sheepMis)
        //     .to(2, { y: -60 }, { easing: 'sineOutIn' })
        //     .start()
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        (gameContext.player as hero).state = State.standRight
        cc.tween(this.water)
            .to(3, { height: 350 }, { easing: 'cubicIn' })
            .delay(1)
            .call(() => {
                gameConfig.maxLevel = 5
                gameConfig.memoryLength = 5
                gameConfig.currMemory = 5
                cc.director.loadScene("startScene", () => {
                    gameContext.showMemoryUI(true)
                });
            })
            .start()
    }

    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()
        if ((gameContext.player as hero).state == State.fight && this._touchSheep == true) {
            this.fight()
        }


        // let sheepPos = this.page1.convertToWorldSpaceAR(this.sheep.getPosition())
        // Logger.log('heroX:'+ gameContext.playerNode.x)
        // Logger.log('sheepX:'+ sheepPos.x)
        // Logger.log('heroY:'+ gameContext.playerNode.y)
        // Logger.log('sheepY:'+ sheepPos.y)
        // if (this._touchSheep == false && Math.abs(sheepPos.x - gameContext.playerNode.x) < 100 && Math.abs(sheepPos.y - gameContext.playerNode.y) < 120) {
        //     let endPos = this.couldList[(this.idX++) % this.couldList.length].getPosition()
        //     this._touchSheep = true
        //     Logger.log('????????????')
        //     this.sheep.runAction(cc.sequence(cc.moveTo(1, endPos), cc.callFunc(() => { this._touchSheep = false })))
        // }
    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
