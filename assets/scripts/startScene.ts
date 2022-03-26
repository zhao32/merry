// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import GameTools, { gameConfig, gameContext } from "./utils/GameTools";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    loadtext: cc.Label = null;

    @property
    text: string = 'hello';

    @property({ type: cc.ProgressBar })
    loadbar: cc.ProgressBar;

    @property({ type: cc.Node })
    LoadUI: cc.Node;

    is_loading: boolean
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene("playScene", function () {
            cc.log("Next scene playScene preloaded");
        });
        console.log('开始')
        this.loadGameData()


    }

    onLoadComplete() {
        this.is_loading = false;
        // this.loadbar.node.active = false;
        // this.loadtext.node.active = false;
        cc.loader.onProgress = null
        // cc.director.loadScene("startScene");
        gameContext.hasLoad = true
        if (this.LoadUI) this.LoadUI.active = false
        gameContext.showStartUI()

        //cc.vv.AudioAction.PlayBGM('bg_one.mp3');

    }
    start() {
        this.LoadUI = this.node.getChildByName('loadUI')
        this.loadbar = this.LoadUI.getChildByName('loading').getComponent(cc.ProgressBar)
        this.loadtext = this.LoadUI.getChildByName('loading').getChildByName('loadtext').getComponent(cc.Label)
        if (gameContext.hasLoad) {
            this.LoadUI.active = false
            return
        }
        this.LoadUI.active = true
        this.is_loading = true;
        let jindu = 0
        cc.loader.onProgress = null

        cc.loader.onProgress = (completedCount, totalCount, item) => {
            // if (totalCount < 10) return
            console.log('totalCount:' + totalCount)
            if (totalCount !== 0 && this.is_loading === true) {
                console.log('completedCount:' + completedCount)
                console.log('totalCount:' + totalCount)
                jindu = completedCount / totalCount;
            }
            this.loadbar.progress = jindu;
            const number_jindu = jindu * 100
            this.loadtext.string = number_jindu.toFixed(0) + '%';
        }

        cc.loader.loadResDir("sound", (err, assets, urls) => {
            if (!err) {
                // console.log(JSON.stringify(assets))
                cc.log(`加载资源${err ? '失败' : '成功'}`)
                this.onLoadComplete();
                console.log(JSON.stringify(urls))
            } else {
                console.error('err:' + err)
            }
        });

    }


    loadGameData() {
        GameTools.load('gameData', null, (err, res) => {
            cc.log(`加载游戏数据${err ? '失败' : '成功'}`)
            if (!err) {
                var object = res.json
                for (const key in object) {
                    if (Object.prototype.hasOwnProperty.call(object, key)) {
                        gameConfig[key] = object[key]
                    }
                }
            }
        })
    }

    // update (dt) {}
}
