// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Logger } from "../Logger";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    @property(cc.Node)
    baoMu: cc.Node = null;

    @property(cc.Label)
    infoDisplay: cc.Label = null;


    callback: any

    init(data: any, callback) {
        this.callback = callback
        this.baoMu.active = false
    }
    _canTouch: boolean = true

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.zIndex = 1
        this._canTouch = true
        for (let i = 0; i < 9; i++) {
            let box = this.node.getChildByName(`box${i}`)
            box.on(cc.Node.EventType.TOUCH_END, this.selectPass, this)
            let idxDisplay = box.getChildByName('idx').getComponent(cc.Label)
            idxDisplay.string = String(i + 1)

            let nameLabel = box.getChildByName('name')
            // if (i > gameConfig.maxLevel) {
                nameLabel.active = false
                box.active = false
            // } else {
                nameLabel.active = true
                box.active = true
                nameLabel.getComponent(cc.Label).string = gameConfig.levelData[i].name
            // }

        }

    }

    start() {

    }

    selectPass(touch: any) {
        // Logger.log(touch)
        if (this._canTouch == false) return
        this._canTouch = false
        let name: string = touch.target.name
        let level = parseInt(name.charAt(name.length - 1))
        // if (level > gameConfig.maxLevel) {
            gameContext.showToast('请先通关之前关卡')
        // } else {
            Logger.log('打开关卡' + level)
            gameConfig.currLevel = level
            GameTools.loadSound(`sound/level/${level + 1}/levelname`, 0, false, null, true)
            this.baoMu.active = true
            let indx = ['一', '二', '三', '四', '五', '六', '七', '八', '九',]
            this.infoDisplay.string = `第${indx[level]}关 ${gameConfig.levelData[level].name}`
            this.scheduleOnce(() => {
                this._canTouch = true
                cc.director.loadScene("playScene", () => {
                    // gameContext.showStartUI(true)
                });
                // this.baoMu.active = false
            }, 5)

            // Logger.log(cc.director.runScene())
        // }
        GameTools.loadSound('sound/op/click', 1, false)
    }

    // update (dt) {}
}
