// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import List from "../ListView/List";
import { Logger } from "../Logger";
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

    @property(cc.Node)
    baoMu: cc.Node = null;

    @property(cc.Node)
    videoArea: cc.Node = null;

    @property({ type: cc.VideoPlayer })
    videoPlayer: cc.VideoPlayer = null;


    @property(cc.Label)
    infoDisplay: cc.Label = null;


    callback: any

    btnRetrun: cc.Node
    btnNext: cc.Node

    mask: cc.Node
    displayItem: cc.Node
    isFromGame: boolean

    maskStart: cc.Node
    itemStart: cc.Node

    init(data: any, callback) {
        this.callback = callback
        this.isFromGame = data
        GameTools.loadSound(`sound/bgm/bgmMenoy`, 0, true)
        this.videoArea.active = false
    }

    onVideoPlayerEvent(sender, event) {
        // this.statusLabel.string = 'Status: ' + getStatus(event);
        if (event === cc.VideoPlayer.EventType.CLICKED) {
            if (this.videoPlayer.isPlaying()) {
                this.videoPlayer.pause();
                Logger.log('点击暂停')
            } else {
                this.videoPlayer.play();
                Logger.log('点击播放')
            }
        } else if (event === cc.VideoPlayer.EventType.COMPLETED) {
            Logger.log('播放完成')
            this.videoArea.active = false
            gameContext.showStartUI()
            GameTools.destroyNode(this.node)
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        this.node.zIndex = 2

        this.displayItem = this.node.getChildByName('itemShow')
        this.mask = this.node.getChildByName('mask')
        this.maskStart = this.node.getChildByName('maskStart')
        this.itemStart = this.node.getChildByName('itemStart')

        this.maskStart.active = false
        this.itemStart.active = false
        this.baoMu.active = false


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
                GameTools.loadSound('sound/op/click', 1, false)
            }, this)
            itemMask.active = true
        }
        if (gameConfig.currLevel == 8) {
            this.btnNext.getChildByName('label').getComponent(cc.Label).string = '最后的话'
        } else {
            this.btnNext.getChildByName('label').getComponent(cc.Label).string = '下一关'
        }
    }

    doReturn() {
        GameTools.destroyNode(this.node)
        gameContext.showStartUI()
        GameTools.loadSound('sound/op/click', 1, false)
    }

    doNext() {
        if (gameConfig.nextIsVedio) {
            gameContext.showVideoPlayerUI();
            GameTools.destroyNode(this.node)
            return
        }
        if (gameConfig.currLevel == 8) {
            this.videoArea.active = true
            this.videoPlayer.play()
            cc.audioEngine.stopMusic();
            return
        }
        gameConfig.currLevel += 1
        gameConfig.currLevel = gameConfig.currLevel % 9

        GameTools.loadSound(`sound/level/${gameConfig.currLevel + 1}/levelname`, 0, false, null, true)
        this.baoMu.active = true
        let indx = ['一', '二', '三', '四', '五', '六', '七', '八', '九',]
        this.infoDisplay.string = `第${indx[gameConfig.currLevel]}关 ${gameConfig.levelData[gameConfig.currLevel].name}`
        this.scheduleOnce(() => {
            // this._canTouch = true
            // this.baoMu.active = false

            cc.director.loadScene("playScene", () => {
                // gameConfig.currLevel += 1
                // gameConfig.currLevel = gameConfig.currLevel % 9
            });
        }, 5)

        GameTools.loadSound('sound/op/click', 1, false)
    }

    start() {
        GameTools.loadItemIcon(`pic/item${gameConfig.currMemory - 1}`, this.itemStart)
        // let data = [0, 1, 2, 3, 4, 5, 6]
        // gameContext.memoryLength = 6
        // Logger.log('gameContext.memoryLength:' + gameContext.memoryLength)
        let data = new Array(gameConfig.memoryLength)
        if (this.isFromGame) {
            // this.scroll.scrollTo(cc.v2((gameConfig.currMemory) / 9, 0), 0.1);
            if (gameConfig.currMemory < 5) {
                this.scroll.scrollToLeft();
            } else {
                this.scroll.scrollToRight();
            }
            this.itemStart.active = true
            this.itemStart.runAction(cc.sequence(cc.delayTime(1), cc.scaleTo(2, 0), cc.callFunc(() => {
                this.itemStart.setScale(0, 0)
                this.itemStart.active = true
            })))
            // this.maskStart.active = true
        } else {
            this.scroll.scrollTo(cc.v2((gameConfig.memoryLength) / 5, 0), 0.1);
        }

        for (let i = 0; i < data.length; i++) {
            data[i] = `pic/item${i}`
            let item = this.content.getChildByName(`Item${i}`)
            let itemMask = item.getChildByName('itemMask')
            let itemShow = item.getChildByName('item')
            GameTools.loadItemIcon(data[i], itemShow)
            if (i == gameConfig.currMemory - 1 && this.isFromGame) {
                itemMask.active = true
                itemShow.opacity = 0

                itemMask.runAction(cc.sequence(cc.fadeOut(1), cc.callFunc(() => {
                    itemMask.active = false
                    itemMask.opacity = 255
                    let callF = cc.callFunc(() => {
                        itemShow.opacity = 255

                    })
                    if (this.isFromGame) {
                        itemShow.runAction(cc.sequence(cc.delayTime(2), callF, cc.blink(1, 3)))
                    } else {
                        itemShow.runAction(cc.sequence(cc.delayTime(0.5), callF, cc.blink(1, 3)))
                    }
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
    //     // Logger.log(touch)
    //     let name: string = touch.target.name
    //     let level = parseInt(name.charAt(name.length - 1))
    //     if (level > gameConfig.maxLevel) {
    //         gameContext.showToast('请先通关之前关卡')
    //     } else {
    //         Logger.log('打开关卡' + level)
    //         gameConfig.currLevel = level
    //         cc.director.loadScene("playScene");
    //         // Logger.log(cc.director.runScene())
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
        GameTools.loadSound('sound/op/click', 1, false)
    }

    // update (dt) {}
}
