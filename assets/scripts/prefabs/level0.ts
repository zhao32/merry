// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import hero, { State } from "../hero";
import EventMgr from "../utils/EventMgr";
import GameTools, { gameConfig, gameContext } from "../utils/GameTools";
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

    toggle3: cc.Toggle = null

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
        EventMgr.getInstance().registerListener(EventMgr.TOUCHTSHOP, this, this.touchShop.bind(this))
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
        this.toggle3 = this.toggle.getChildByName('toggle3').getComponent(cc.Toggle)

        this.toggle0.node.on('toggle', this.doToggle, this)
        this.toggle1.node.on('toggle', this.doToggle, this)
        this.toggle2.node.on('toggle', this.doToggle, this)
        this.toggle3.node.on('toggle', this.doToggle, this)

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
        this.toggle3.node.off('toggle')


        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHMASK, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHVIRUS, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHTSHOP, this)

        EventMgr.getInstance().unRegisterListener(EventMgr.TOUCHFINISH, this)
        EventMgr.getInstance().unRegisterListener(EventMgr.RESTART, this)
        GameTools.destroyNode(this.node)

    }



    resetToggle() {
        this.toggle0.isChecked = this.toggle1.isChecked = this.toggle2.isChecked = false
        this.answer = ''
    }

    doToggle(event: cc.Toggle) {
        GameTools.loadSound('sound/op/click', 1, false)
        var toggle = event;
        if (toggle.isChecked) {
            this.answer = toggle.node.name
            for (let i = 0; i < 4; i++) {
                if (this[`toggle${i}`].name != toggle.name) {
                    this[`toggle${i}`].isChecked = false
                }
            }
        }
        let check = false
        for (let i = 0; i < 4; i++) {
            if (this[`toggle${i}`].isChecked == true) {
                check = true
            }
        }

        if (!check) this.answer = ''
    }

    doSelected() {
        GameTools.loadSound('sound/op/click', 1, false)
        if (!this.answer) {
            gameContext.showToast('请选择答案')
        } else if (this.answer == this.toggle2.node.name) {
            console.log('选择正确')
            this.chat.active = false
            this.selectMilk.active = false
        } else {
            console.log('选择错误')
            this.chat.active = false
            this.selectMilk.active = false
            // gameContext.showToast('你谁啊！')
        }

        let naicha = gameContext.playerNode.getChildByName('naicha')
        if (naicha) {
            naicha.active = true
            GameTools.loadSound('sound/level/1/touchMask', 1, false)
            this.scheduleOnce(() => {
                naicha.active = false
            }, 2)
        }

        GameTools.loadSound('sound/level/1/money', 1, false)
        this.weChat.active = true
        this.weChat.getChildByName('shop').active = true
        this.scheduleOnce(() => {
            this.weChat.active = false
            this.weChat.getChildByName('shop').active = false
        }, 2)
    }

    Restart() {
        this.unscheduleAllCallbacks()
        gameContext.hasFllow = false;
        this.distance = 0
        gameContext.moveType = 1
        this.setSyncPosition()

        this.node.setPosition(-500, 0)
        // this.weChat.x = 1067
        this.setSyncPosition()

        this.failPage.getChildByName('flight').x = -200
        gameConfig.currLevel = 0
        this.hasMask = false
        this.death = false
        this.weChat.active = false
        this.weChatLeft.active = false
        this.weChatRight.active = false
        this.weChat.parent = this.node.parent.parent
        this.weChat.getChildByName('shop').active = false
        this.weChat.getChildByName('rat').active = false


        this.selectMilk.active = false
        this.chat.active = false
        this.Mask.active = true
        this.Finish.active = true

        this.failPage.active = false

        gameContext.playerNode.active = false;

        this.resetToggle()
        this.preStart()
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
    }

    /**前情提要 */
    preStart() {
        let preTime = 1

        this.scheduleOnce(() => {
            this.weChat.active = true
            this.weChat.x = 0
        }, 1)
        console.log('播放音效')

        this.scheduleOnce(() => {
            this.weChatLeft.active = true
            console.log('播放音效')
            GameTools.loadSound('sound/level/wechat0', 1, false)

        }, preTime + 1)
        console.log('播放音效')
        this.scheduleOnce(() => {
            this.weChatRight.active = true
            console.log('播放音效')
            GameTools.loadSound('sound/level/wechat1', 1, false)
        }, preTime + 2)

        this.scheduleOnce(() => {
            this.weChat.active = false
            // this.weChat.removeFromParent()
            this.weChatLeft.active = false
            this.weChatRight.active = false
            gameContext.playerNode.active = true;
            (gameContext.player as hero).aniType = 'normal'
            gameContext.playerNode.setPosition(400, -165);
            (gameContext.player as hero).state = State.standRight
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
        GameTools.loadSound('sound/level/1/touchMask', 1, false)

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
            GameTools.loadSound('sound/level/1/touchVirus', 1, false)
            console.log('血量减少')
            this.failPage.active = true
            this.death = true
            gameContext.playerNode.active = false
            this.failPage.x = -this.node.x
            this.failPage.getChildByName('flight').runAction(cc.moveBy(2, new cc.Vec2(2000, 0)))
            EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
            this.scheduleOnce(() => {
                // this.setSyncPosition()
                this.Restart()
                // this.Restart()
            }, 2)
        }
    }

    touchFinish() {
        if (this.answer != this.toggle2.node.name) {
            this.weChat.active = true
            this.weChat.getChildByName('rat').active = true
            GameTools.loadSound('sound/level/wechat0', 1, false)

            this.scheduleOnce(() => {
                this.weChat.active = false
                this.weChat.getChildByName('rat').active = false
            }, 2)
            return
        }
        // let naicha = gameContext.playerNode.getChildByName('naicha')
        // if (naicha.active == false) return
        // else {
        //     naicha.active = false
        // }

        console.log('达成通关')
        GameTools.loadSound('sound/level/1/touchFinish', 1, false)
        gameConfig.maxLevel = 1
        gameConfig.memoryLength = 1
        gameConfig.currMemory = 1
        this.unscheduleAllCallbacks()
        EventMgr.getInstance().sendListener(EventMgr.CLOSEOPERATE, {});
        (gameContext.player as hero).state = State.standRight
        this.scheduleOnce(() => {
            cc.director.loadScene("startScene", () => {
                gameContext.showMemoryUI(true)
            });
        }, 5)
    }

    touchShop() {
        if (this.answer == this.toggle2.node.name) return
        console.log('到达商店')
        this.chat.active = true
        this.scheduleOnce(() => {
            this.selectMilk.active = true
        }, 1)

    }


    update(dt) {
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI && !operateUI.canOperate) return
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
                if (gameContext.playerNode.x > 400 && (gameContext.player as hero).state == State.walkRight) {
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

        let nodeWidth = this.node.width
        let sceneWidth = this.node.parent.width
        let posRight = sceneWidth - nodeWidth

        if (this.node.x <= posRight) {
            this.node.x = posRight
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


        if (gameContext.moveType == 1 && gameContext.playerNode.active == true) {
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
