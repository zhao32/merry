// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Logger } from "../Logger";
import GameTools, { gameContext } from "../utils/GameTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.VideoPlayer })
    videoPlayer: cc.VideoPlayer = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        console.log('memoryVideo---------------start')
        let self = this
        cc.assetManager.loadRemote(`https://game.vip.hnhxzkj.com/Merry/propose.mp4`, function (err, video) {
            if (!err) {
                console.log('加载propose远程视频成功')
                self.videoPlayer.play()
            }
        });

    }

    callback: any
  

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
            gameContext.showStartUI()
            GameTools.destroyNode(this.node)
        }
    }

    init(data: any, callback) {
        console.log('memoryVideo---------------start')
        this.callback = callback
    }


    // update (dt) {}
}
