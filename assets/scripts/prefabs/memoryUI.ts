// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import List from "../ListView/List";
import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;
    @property(cc.Node)

    content: cc.Node = null;

    @property
    text: string = 'hello';

    @property({ type: cc.ScrollView })
    scroll: cc.ScrollView = null;

    callback: any

    btnRetrun: cc.Node
    btnNext: cc.Node

    mask: cc.Node
    displayItem: cc.Node
    isFromGame: boolean

    init(data: any, callback) {
        this.callback = callback
        this.isFromGame = data
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.displayItem = this.node.getChildByName('itemShow')
        this.mask = this.node.getChildByName('mask')

        this.btnRetrun = this.node.getChildByName('btnRetrun')
        this.btnNext = this.node.getChildByName('btnNext')

        this.btnRetrun.on(cc.Node.EventType.TOUCH_END, this.doReturn, this)
        this.btnNext.on(cc.Node.EventType.TOUCH_END, this.doNext, this)
        this.mask.on(cc.Node.EventType.TOUCH_END, this.hideItem, this)

        this.mask.active = false
        this.displayItem.active = false
        EventMgr.getInstance().registerListener(EventMgr.SHOWMEMRY, this, this.showItem.bind(this))

        for (let i = 0; i < 10; i++) {
            let item = this.content.getChildByName(`Item${i}`)
            let itemMask = item.getChildByName('itemMask')
            let itemShow = item.getChildByName('item')
            let itemSelect = item.getChildByName('itemSelect')

            itemShow.on(cc.Node.EventType.TOUCH_END, () => {
                this.showItem(i)
                for (let k = 0; k < 10; k++) {
                    let item = this.content.getChildByName(`Item${k}`)
                    let itemSelect = item.getChildByName('itemSelect')
                    itemSelect.active = false
                }
                itemSelect.active = true
            }, this)
            itemMask.active = true
        }
    }

    doReturn() {
        gameContext.showStartUI()
    }

    doNext() {
        cc.director.loadScene("playScene", () => {
            gameConfig.currLevel += 1
            // gameContext.showLevel(gameConfig.currLevel + 1)
        });
    }

    start() {
        // let data = [0, 1, 2, 3, 4, 5, 6]
        // gameContext.memoryLength = 6
        // console.log('gameContext.memoryLength:' + gameContext.memoryLength)
        let data = new Array(gameConfig.memoryLength)
        if (this.isFromGame) {
            this.scroll.scrollTo(cc.v2((gameConfig.currMemory) / 5, 0), 0.1);
        } else {
            this.scroll.scrollTo(cc.v2((gameConfig.memoryLength) / 5, 0), 0.1);
        }

        for (let i = 0; i < data.length; i++) {
            data[i] = `pic/item${i}`
            let item = this.content.getChildByName(`Item${i}`)
            let itemMask = item.getChildByName('itemMask')
            let itemShow = item.getChildByName('item')
            GameTools.loadItemIcon(data[i], itemShow)
            if (i == gameConfig.currMemory && this.isFromGame) {
                itemMask.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(() => {
                    itemMask.active = false
                    itemMask.opacity = 255
                    itemShow.runAction(cc.sequence(cc.delayTime(.5), cc.blink(1, 3)))
                })))
            } else {
                itemMask.active = false
            }
        }

        if (this.isFromGame) {
            this.btnNext.active = true
            this.btnRetrun.active = false
        } else {
            this.btnNext.active = false
            this.btnRetrun.active = true
        }
    }

    onDisable() {
        EventMgr.getInstance().unRegisterListener(EventMgr.SHOWMEMRY, this)

    }

    // selectPass(touch: any) {
    //     // console.log(touch)
    //     let name: string = touch.target.name
    //     let level = parseInt(name.charAt(name.length - 1))
    //     if (level > gameConfig.maxLevel) {
    //         gameContext.showToast('请先通关之前关卡')
    //     } else {
    //         console.log('打开关卡' + level)
    //         gameConfig.currLevel = level
    //         cc.director.loadScene("playScene");
    //         // console.log(cc.director.runScene())
    //     }
    // }

    showItem(idx: number) {
        this.displayItem.active = true
        this.mask.active = true
        GameTools.loadItemIcon(`pic/item${idx}`, this.displayItem)
    }

    hideItem() {
        this.displayItem.active = false
        this.mask.active = false
    }

    // update (dt) {}
}
