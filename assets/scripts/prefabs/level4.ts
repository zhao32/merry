// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";
import { State } from "../hero";


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
    label0: cc.Label
    label1: cc.Label

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

        this.label0 = this.page0.getChildByName('label0').getComponent(cc.Label)
        this.label1 = this.page0.getChildByName('label1').getComponent(cc.Label)

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

    onDisable(){
        console.log('------------------第6关注销监听------------------')
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHSHEEP, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
    }


    start() {
        this.Restart()
    }

    Restart() {
        gameContext.moveType = 0
        this.page0.active = true
        this.page1.active = false
        this.page2.active = false

        this.label0.string = ''
        this.label1.string = ''

        this.idX = 0
        this.hpNum = 10
        this._touchSheep = false
        this.sheep.setPosition(this.couldList[0].x, this.couldList[0].y + 60)

        this.sheepMis.y = -500
        this.water.height = 100
        this.ratTear.active = true

        gameConfig.currLevel = 5
        gameContext.playerNode.setPosition(200, -185)
        gameContext.playerNode.active = false
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        this.unscheduleAllCallbacks()
        this.sheep.stopAllActions()
        this.preStart()
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            this.label0.string = '【鼠】:我想吃小羊羔'
        }, preTime)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.label1.string = '【猴】:好哦，盐水吊完就去吃'
        }, preTime + 2)

        this.scheduleOnce(() => {
            this.page0.active = false
            this.page1.active = true
            gameContext.playerNode.active = true
            gameContext.player.state = State.standRight;

            EventMgr.getInstance().sendListener(EventMgr.OPENOPERATE, {
                left: true,
                right: true,
                top: false,
                down: false,
                fight: false,
                jump: true
            });

        }, preTime + 4)
    }

    touchSheep() {
        this.idX++
        let endPos = this.couldList[(this.idX) % this.couldList.length].getPosition()
        this._touchSheep = true
        console.log('碰到小羊')
        endPos.y += 60
        this.sheep.runAction(cc.sequence(cc.moveTo(1, endPos), cc.callFunc(() => { this._touchSheep = false })))
        this.hpNum--
        this.hp.scaleX = this.hpNum / 10
        if (this.hpNum == 1) {
            this.sheep.runAction(cc.sequence(cc.moveTo(1, new cc.Vec2(0, 500)), cc.callFunc(() => {
                console.log('追样结束')
                this.page1.active = false
                gameContext.playerNode.active = false
                this.showOverPage()
            })))
        }
    }

    showOverPage() {
        this.page2.active = true
        this.ratTear.active = true
        cc.tween(this.sheepMis)
            .to(2, { y: -60 }, { easing: 'sineOutIn' })
            .start()

        cc.tween(this.water)
            .to(2, { height: 350 }, { easing: 'sineOutIn' })
            .delay(1)
            .call(() => {
                gameConfig.maxLevel = 6
                cc.director.loadScene("startScene", () => {
                    gameContext.memoryLength = 6
                    gameContext.showMemoryUI()
                });
            })
            .start()
    }

    update(dt) {
        // this.node.x += 1
        // this.setSyncPosition()


        // let sheepPos = this.page1.convertToWorldSpaceAR(this.sheep.getPosition())
        // console.log('heroX:'+ gameContext.playerNode.x)
        // console.log('sheepX:'+ sheepPos.x)
        // console.log('heroY:'+ gameContext.playerNode.y)
        // console.log('sheepY:'+ sheepPos.y)
        // if (this._touchSheep == false && Math.abs(sheepPos.x - gameContext.playerNode.x) < 100 && Math.abs(sheepPos.y - gameContext.playerNode.y) < 120) {
        //     let endPos = this.couldList[(this.idX++) % this.couldList.length].getPosition()
        //     this._touchSheep = true
        //     console.log('碰到小羊')
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
