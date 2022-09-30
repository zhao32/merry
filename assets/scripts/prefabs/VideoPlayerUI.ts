// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { Logger } from "../Logger";
import { gameConfig, gameContext } from "../utils/GameTools";

const { ccclass, property } = cc._decorator;

function getStatus(event) {
    switch (event) {
        case cc.VideoPlayer.EventType.PLAYING:
            return 'PLAYING';
        case cc.VideoPlayer.EventType.PAUSED:
            return 'PAUSED';
        case cc.VideoPlayer.EventType.STOPPED:
            return 'STOPPED';
        case cc.VideoPlayer.EventType.COMPLETED:
            return 'COMPLETED';
        case cc.VideoPlayer.EventType.META_LOADED:
            return 'META_LOADED';
        case cc.VideoPlayer.EventType.CLICKED:
            return 'CLICKED';
        case cc.VideoPlayer.EventType.READY_TO_PLAY:
            return 'READY_TO_PLAY';
        default:
            return 'NONE';
    }
};

@ccclass
export default class NewClass extends cc.Component {

    @property({ type: cc.VideoPlayer })
    videoPlayer: cc.VideoPlayer = null;
    @property(cc.Node)
    videoArea: cc.Node = null;

    @property(cc.Node)
    choiseArea: cc.Node = null;

    @property(cc.Node)
    btnYes: cc.Node = null;

    @property(cc.Node)
    btnNo: cc.Node = null;

    loaded: boolean = false


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    init() {

    }

    start() {
        cc.audioEngine.stopMusic();
        // this.playVideoArea.on('touchend', () => {
        //     this.videoPlayer.play();
        //     Logger.log('点击播放')
        // });
        this.videoArea.active = true
        this.choiseArea.active = false
        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            console.log('点击')
            if (this.loaded) {
                this.videoPlayer.play()
            }
        }, this)

        let self = this
        self.videoPlayer.remoteURL = `https://game.vip.hnhxzkj.com/Merry/menony.mp4`

        cc.assetManager.loadRemote(`https://game.vip.hnhxzkj.com/Merry/menony.mp4`, function (err, video) {
            if (!err) {
                console.log('加载menony远程视频成功')
                self.videoPlayer.play()
                self.loaded = true
            }
        });

        // this.scheduleOnce(
        //     () => {
        //         this.videoPlayer.play()
        //     },
        //     0.5)
        this.btnNo.on(cc.Node.EventType.TOUCH_END, () => {
            Logger.log('不愿意')
            cc.director.loadScene("startScene", () => {
                gameContext.showStartUI()
                gameConfig.maxLevel = 0
                gameConfig.currLevel = 0
            });
        }, this)
        this.btnYes.on(cc.Node.EventType.TOUCH_END, () => {
            Logger.log('愿意')
            gameConfig.maxLevel = 8
            gameConfig.memoryLength = 9
            gameConfig.currMemory = 9
            gameConfig.nextIsVedio = false
            cc.director.loadScene("startScene", () => {
                Logger.log('切换到开始页面')
                // this.scheduleOnce(()=>{
                //     gameContext.showMemoryUI(true)
                // },.5)
                gameContext.showMemoryUI(true)
            });
        }, this)

    }

    onVideoPlayerEvent(sender, event) {
        // this.statusLabel.string = 'Status: ' + getStatus(event);
        if (event === cc.VideoPlayer.EventType.CLICKED) {
            if (!this.loaded) return
            if (this.videoPlayer.isPlaying()) {
                this.videoPlayer.pause();
                Logger.log('点击暂停')
            } else {
                this.videoPlayer.play();
                Logger.log('点击播放')
            }
        } else if (event === cc.VideoPlayer.EventType.COMPLETED) {
            Logger.log('VideoPlayer视频播放完成')
            this.videoArea.active = false
            this.choiseArea.active = true
        }
        // else if (event === cc.VideoPlayer.EventType.READY_TO_PLAY || event === cc.VideoPlayer.EventType.META_LOADED) {
        //     this.controlButtons.active = true;
        //     this.playVideoArea.active = true;
        // }
        // else if (event === cc.VideoPlayer.EventType.PLAYING) {
        //     this.playVideoArea.active = false;
        // }
    }

    // update (dt) {}
}
