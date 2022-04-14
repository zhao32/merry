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

    @property
    text: string = 'hello';

    callback: any

    private memoryList: List;         //排行榜

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
        this.memoryList = this.node.getChildByName('ScrollView').getComponent(List)
        // cc.find("ScrollView", this.node).getComponent(List);
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

    }

    doReturn() {
        gameContext.showStartUI()
    }

    doNext() {
        cc.director.loadScene("playScene",()=>{
            gameContext.showLevel(gameConfig.currLevel + 1)
        });
    }

    start() {
        // let data = [0, 1, 2, 3, 4, 5, 6]
        Logger.log('gameContext.memoryLength:' + gameContext.memoryLength)
        let data = new Array(gameContext.memoryLength)
        for (let i = 0; i < data.length; i++) {
            data[i] = `pic/item${i}`
        }
        this.memoryList.setData(data)

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

    selectPass(touch: any) {
        // Logger.log(touch)
        let name: string = touch.target.name
        let level = parseInt(name.charAt(name.length - 1))
        if (level > gameConfig.maxLevel) {
            gameContext.showToast('请先通关之前关卡')
        } else {
            Logger.log('打开关卡' + level)
            gameConfig.currLevel = level
            cc.director.loadScene("playScene");
            // Logger.log(cc.director.runScene())
        }
    }

    showItem(self, param) {
        this.displayItem.active = true
        this.mask.active = true
        Logger.log('param:' + param)
        GameTools.loadItemIcon(param.data, this.displayItem)
    }

    hideItem() {
        this.displayItem.active = false
        this.mask.active = false
    }

    // update (dt) {}
}
