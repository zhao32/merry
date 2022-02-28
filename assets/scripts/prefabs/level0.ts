// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero, { State } from "../hero";
import EventMgr from "../utils/EventMgr";
import { gameConfig, gameContext } from "../utils/GameTools";
import operateUI from "./operateUI";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    // @property(cc.Node)
    Mask: cc.Node = null;

    // @property(cc.Node)
    Virus: cc.Node = null;

    // @property(cc.Node)
    Finish: cc.Node = null;

    // @property(cc.Node)
    failPage: cc.Node = null;
    weChat: cc.Node = null
    // @property(cc.Node)
    weChatLeft: cc.Node = null;

    // @property(cc.Node)
    weChatRight: cc.Node = null;

    shop: cc.Node = null
    // @property(cc.Node)
    chat: cc.Node = null;

    // @property(cc.Node)
    btnOk: cc.Node = null;

    // @property(cc.Node)
    selectMilk: cc.Node = null;
    toggle: cc.Node = null
    // @property({ type: cc.Toggle })
    toggle0: cc.Toggle = null

    // @property({ type: cc.Toggle })
    toggle1: cc.Toggle = null

    // @property({ type: cc.Toggle })
    toggle2: cc.Toggle = null

    death: boolean = false



    answer: string = ''
    hasMask: boolean = false

    distance: number = null


    @property
    text: string = 'hello';

    callback: any

    init(data: any, callback) {
        this.callback = callback
        // this.Restart()
        // this.preStart()
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.node.setAnchorPoint(0, 0.5)
        this.node.setPosition(0, 0)
        this.setSyncPosition()
        // gameContext.currLevelScript = this.node.getComponent('level0')
        EventMgr.getInstance().registerListener(EventMgr.TOUCHMASK, this, this.touchMask.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHVIRUS, this, this.touchVirus.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.TOUCHFINISH, this, this.touchFinish.bind(this))
        EventMgr.getInstance().registerListener(EventMgr.RESTART, this, this.Restart.bind(this))

        this.Mask = this.node.getChildByName('Mask')
        // this.Virus = this.node.getChildByName('Virus')
        this.Finish = this.node.getChildByName('Finish')
        this.failPage = this.node.getChildByName('fail')
        this.shop = this.node.getChildByName('shop')
        this.weChat = this.node.getChildByName('weChat')

        this.weChatLeft = this.weChat.getChildByName('weChatLeft')
        this.weChatRight = this.weChat.getChildByName('weChatRight')

        this.chat = this.shop.getChildByName('chat')
        this.selectMilk = this.shop.getChildByName('select')
        this.btnOk = this.selectMilk.getChildByName('btnOk')
        this.toggle = this.selectMilk.getChildByName('toggle')
        console.log('toggle:' + this.toggle)
        this.toggle0 = this.toggle.getChildByName('toggle0').getComponent(cc.Toggle)
        this.toggle1 = this.toggle.getChildByName('toggle1').getComponent(cc.Toggle)
        this.toggle2 = this.toggle.getChildByName('toggle2').getComponent(cc.Toggle)

        this.toggle0.node.on('toggle', this.doToggle, this)
        this.toggle1.node.on('toggle', this.doToggle, this)
        this.toggle2.node.on('toggle', this.doToggle, this)
        this.btnOk.on(cc.Node.EventType.TOUCH_END, this.doSelected, this)

    }


    start() {
        this.Restart()
    }


    onDisable() {
        console.log('------------------第一关销毁------------------')
        this.toggle0.node.off('toggle')
        this.toggle1.node.off('toggle')
        this.toggle2.node.off('toggle')

        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHMASK, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHVIRUS, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHFINISH, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
    }



    resetToggle() {
        this.toggle0.isChecked = this.toggle1.isChecked = this.toggle2.isChecked = false
        this.answer = ''
    }

    doToggle(event: cc.Toggle) {
        var toggle = event;
        if (toggle.isChecked) {
            this.answer = toggle.node.name
            for (let i = 0; i < 3; i++) {
                if (this[`toggle${i}`].name != toggle.name) {
                    this[`toggle${i}`].isChecked = false
                }
            }
        }
        let check = false
        for (let i = 0; i < 3; i++) {
            if (this[`toggle${i}`].isChecked == true) {
                check = true
            }
        }

        if (!check) this.answer = ''
    }

    doSelected() {

        if (!this.answer) {
            gameContext.showToast('请选择答案')
        } else if (this.answer == this.toggle2.node.name) {
            console.log('选择正确')
            this.chat.active = false
            this.selectMilk.active = false
            gameConfig.maxLevel = 1
            this.unscheduleAllCallbacks()
            cc.director.loadScene("startScene", () => {
                gameContext.memoryLength = 1
                gameContext.showMemoryUI()
            });

        } else {
            console.log('选择错误')
            this.chat.active = false
            this.selectMilk.active = false
            gameContext.showToast('你谁啊！')
        }
    }

    Restart() {
        gameContext.hasFllow = false;

        this.distance = 0
        gameContext.moveType = 0
        this.setSyncPosition()

        this.node.setPosition(0, 0)
        this.setSyncPosition()

        this.failPage.getChildByName('flight').x = -200
        gameConfig.currLevel = 0
        this.hasMask = false
        this.death = false

        this.weChatLeft.active = false
        this.weChatRight.active = false
        this.selectMilk.active = false
        this.chat.active = false
        this.Mask.active = true
        this.Finish.active = true

        this.failPage.active = false
        gameContext.playerNode.active = true
        gameContext.playerNode.setPosition(100, -165);
        (gameContext.player as hero).state = State.standRight

        this.resetToggle()
        this.preStart()
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
    }

    /**前情提要 */
    preStart() {
        let preTime = 1
        this.scheduleOnce(() => {
            this.weChatLeft.active = true
            console.log('播放音效')

        }, preTime + 1)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.weChatRight.active = true
            console.log('播放音效')

        }, preTime + 2)

        this.scheduleOnce(() => {
            this.weChatLeft.active = false
            this.weChatRight.active = false
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

    touchMask(self: this, params) {
        console.log('触碰口罩回调')
        self.hasMask = true
        self.Mask.active = false;
        (gameContext.player as hero).aniType = 'mask'
    }

    touchVirus() {
        console.log('触碰病毒回调')
        if (this.death) return
        if (this.hasMask) {
            console.log('免疫病毒')
        } else {
            console.log('血量减少')
            this.failPage.active = true
            this.death = true
            gameContext.playerNode.active = false
            this.failPage.x = -this.node.x
            this.failPage.getChildByName('flight').runAction(cc.moveTo(2, new cc.Vec2(1600, 0)))
            EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
            this.scheduleOnce(() => {
                // this.setSyncPosition()
                this.Restart()
                // this.Restart()
            }, 2)
        }
    }

    touchFinish() {
        console.log('达成通关')
        this.chat.active = true
        this.scheduleOnce(() => {
            this.selectMilk.active = true
        }, 1)
    }


    update(dt) {
        if (this.failPage.active == true) return
        if (this.node.x >= 0) {
            this.node.x = 0
            if (gameContext.moveType == 1) {
                gameContext.moveType = 0
                // this.node.x = 0
                let operateUI: operateUI = gameContext.operateUI
                if ((gameContext.player as hero).state == State.walkRight) {
                    operateUI.startRight()
                } else if ((gameContext.player as hero).state == State.walkLeft) {
                    operateUI.startLeft()
                }

            } else {
                if (gameContext.playerNode.x > 300 && (gameContext.player as hero).state == State.walkRight) {
                    gameContext.moveType = 1
                    let operateUI: operateUI = gameContext.operateUI
                    if ((gameContext.player as hero).state == State.walkRight) {
                        operateUI.startRight()
                    } else if ((gameContext.player as hero).state == State.walkLeft) {
                        operateUI.startLeft()
                    }

                }

            }
        }

        if (this.node.x <= -1334) {
            this.node.x = -1334
            if (gameContext.moveType == 1) {
                gameContext.moveType = 0
                let operateUI: operateUI = gameContext.operateUI
                if ((gameContext.player as hero).state == State.walkRight) {
                    operateUI.startRight()
                } else if ((gameContext.player as hero).state == State.walkLeft) {
                    operateUI.startLeft()
                }
            } else {
                if (gameContext.playerNode.x <= 1100 && (gameContext.player as hero).state == State.walkLeft) {
                    gameContext.moveType = 1
                    let operateUI: operateUI = gameContext.operateUI
                    if ((gameContext.player as hero).state == State.walkRight) {
                        operateUI.startRight()
                    } else if ((gameContext.player as hero).state == State.walkLeft) {
                        operateUI.startLeft()
                    }
                }
            }
        }


        if (gameContext.moveType == 1) {
            this.node.x -= gameContext.viewSpeed
            this.setSyncPosition()
            // this.distance += gameContext.viewSpeed
        }


        // if (gameContext.playerNode.x <= 1100 && this.node.x == -1334) {
        //     if (gameContext.moveType == 0) {
        //         // this.distance = 0
        //         gameContext.moveType = 1
        //         let operateUI: operateUI = gameContext.operateUI
        //         if ((gameContext.player as hero).state == State.walkRight) {
        //             operateUI.startRight()
        //         } else if ((gameContext.player as hero).state == State.walkLeft) {
        //             operateUI.startLeft()
        //         }
        //     }

        // }

        // if (gameContext.moveType == 1) {
        //     this.node.x -= gameContext.viewSpeed
        //     this.setSyncPosition()
        //     this.distance += gameContext.viewSpeed
        // }

        // if (this.node.x > 0) {
        //     this.node.x = 0
        //     this.distance = 0
        //     this.setSyncPosition()
        // }

        // if (this.distance > 1334) {
        //     // gameContext.moveType = 0
        //     let operateUI: operateUI = gameContext.operateUI
        //     if (gameContext.moveType == 1) {
        //         gameContext.moveType = 0
        //         if ((gameContext.player as hero).state == State.walkRight) {
        //             operateUI.startRight()
        //         } else if ((gameContext.player as hero).state == State.walkLeft) {
        //             operateUI.startLeft()
        //         }
        //     }
        // }
    }

    setSyncPosition() {
        let bodys = this.node.getComponentsInChildren(cc.RigidBody)
        for (let i = 0; i < bodys.length; i++) {
            bodys[i].syncPosition(true)
        }
    }
}
