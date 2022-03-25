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

    @property({ type: cc.ProgressBar })
    loadbar: cc.ProgressBar;

    is_loading: boolean
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.director.preloadScene("startScene", function () {
            cc.log("Next scene startScene preloaded");
        });
    }

    onLoadComplete() {
        this.is_loading = false;
        // this.loadbar.node.active = false;
        // this.loadtext.node.active = false;
        cc.loader.onProgress = null
        cc.director.loadScene("startScene");
        //cc.vv.AudioAction.PlayBGM('bg_one.mp3');

    }
    start() {
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
            }else{
                console.error('err:'+err)
            }
        });

    }

    // update (dt) {}
}
