// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameConfig, gameContext } from "./utils/GameTools";
import operateUI from "./prefabs/operateUI";

const { ccclass, property } = cc._decorator;

export enum State {
    standLeft,
    standRight,
    walkLeft,
    walkRight,
    jumpLeft,
    jumpRight,
    fight,
    eat
}


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    fllow: cc.Node

    public _state: number = 0

    private _isJumping: boolean = false

    isMove: Boolean = false//主角是否真实运动，在场景两边时主角移动，场景中间时场景移动

    private readonly Velocity = 200

    private readonly Speed = 3

    private aniObj = {}
    // public aniType = "normal"

    private _aniType = null

    animCtrl: cc.Animation
    animName: string

    public set aniType(type: string) {
        this._aniType = type
        this.state = this._state
    }
    private _attack: boolean

    public set attack(type: boolean) {
        this._attack = type
    }

    public get attack() {
        return this._attack
    }



    // public moveType: number = 0//0 玩家移动 1 背景移动

    onLoad() {

        this.aniObj = {
            normal: {
                jumpLeft: 'jumpLeft',
                jumpRight: 'jumpRight',
                standLeft: 'standLeft',
                standRight: 'standRight',
                walkLeft: 'walkLeft',
                walkRight: 'walkRight',

            },
            mask: {
                jumpLeft: 'maskJumpLeft',
                jumpRight: 'maskJumpRight',
                standLeft: 'maskStandLeft',
                standRight: 'maskStandRight',
                walkLeft: 'maskWalkLeft',
                walkRight: 'maskWalkRight',

            }
        }
        this._aniType = 'normal'
        console.log('aniType：' + this.aniObj[this._aniType].jumpLeft)

        this.isMove = true
        this.state = State.standRight
        this._attack = false
        this.fllow = this.node.getChildByName('fllow')
        let naicha = this.node.getChildByName('naicha')
        if(naicha){
            naicha.active = false
        }
    }

    start() {

    }

    public set isJumping(value: boolean) {
        this._isJumping = value
    }

    public get isJumping() {
        return this._isJumping
    }

    public set state(value: number) {
        this.fllow = this.node.getChildByName('fllow')
        if (this._isJumping) return
        let body = this.node.getComponent(cc.RigidBody)
        let preState = this._state
        this._state = value
        if (gameContext.hasFllow) {
            this.fllow.active = true
        } else {
            this.fllow.active = false
        }
        let ani = ''
        let aniFllow = ''
        let repeatCount: number = Infinity
        if (this._state == State.fight) {
            ani = null
            repeatCount = 1
            if (preState == State.walkLeft || preState == State.standLeft) {
                ani = 'fightLeft'
            } else if (preState == State.walkRight || preState == State.standRight) {
                ani = 'fightRight'
            }
            console.log('ani:' + ani)
            this.attack = true
        } else if (this._state == State.jumpLeft) {
            ani = this.aniObj[this._aniType].jumpLeft
            aniFllow = "ratJumpLeft"
            if (this.isMove) {
                if (gameContext.moveType == 0) {
                    body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
                } else {
                    gameContext.viewSpeed = -this.Speed
                }
            }
            this.playJump()
        } else if (this._state == State.jumpRight) {
            this.fllow.x = -180
            aniFllow = "ratJumpRight"
            ani = this.aniObj[this._aniType].jumpRight
            if (this.isMove) {
                if (gameContext.moveType == 0) {
                    body.linearVelocity = new cc.Vec2(this.Velocity, 0)
                } else {
                    gameContext.viewSpeed = this.Speed
                }
            }
            this.playJump()
        } else if (this._state == State.walkLeft) {
            this.fllow.x = 180

            ani = this.aniObj[this._aniType].walkLeft
            aniFllow = "ratWalkLeft"

            this.isMove = true
            if (gameContext.moveType == 0) {
                body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
            } else {
                gameContext.viewSpeed = -this.Speed
            }
        } else if (this._state == State.walkRight) {
            this.fllow.x = -180

            ani = this.aniObj[this._aniType].walkRight
            aniFllow = "ratWalkRight"

            repeatCount = Infinity
            this.isMove = true
            if (gameContext.moveType == 0) {
                body.linearVelocity = new cc.Vec2(this.Velocity, 0)
            } else {
                gameContext.viewSpeed = this.Speed
            }
        } else if (this._state == State.standLeft) {
            this.fllow.x = 180

            this.isMove = false
            ani = this.aniObj[this._aniType].standLeft
            aniFllow = "ratStandLeft"

            repeatCount = Infinity
            body.linearVelocity = new cc.Vec2(0, 0)
            gameContext.viewSpeed = 0
        } else if (this._state == State.standRight) {
            // this.node.getComponent(cc.Animation).stop()
            // this._dir = this.RIGHT
            aniFllow = "ratStandRight"
            this.fllow.x = -180


            this.isMove = false
            ani = this.aniObj[this._aniType].standRight
            repeatCount = Infinity
            body.linearVelocity = new cc.Vec2(0, 0)
            gameContext.viewSpeed = 0
        } else if (this._state == State.eat) {
            if (preState == State.walkLeft || preState == State.standLeft || preState == State.eat) {
                ani = 'eatLeft'
            } else if (preState == State.walkRight || preState == State.standRight) {
                ani = 'eatRight'

            }
            repeatCount = 1
            // this.isMove = true
            // if (gameContext.moveType == 0) {
            //     body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
            // } else {
            //     gameContext.viewSpeed = -this.Speed
            // }
        }
        if (ani) {
            this.animName = ani
            this.animCtrl = this.node.getComponent(cc.Animation)
            // 注册播放动画结束的回调
            let play = this.animCtrl.play(ani)
            // this.animCtrl.on('stop', this.onAnimStop, this);

            if (play) play.repeatCount = repeatCount
            if (aniFllow) this.fllow.getComponent(cc.Animation).play(aniFllow).repeatCount = repeatCount
            console.log('播放：' + ani)

            this.scheduleOnce(() => {
                let ani
                if (this.animName === 'eatLeft') {
                    ani = this.aniObj[this._aniType].standLeft
                    this.animCtrl.play(ani).repeatCount = Infinity
                }
                if (this.animName === 'eatRight') {
                    ani = this.aniObj[this._aniType].standRight
                    this.animCtrl.play(ani).repeatCount = Infinity
                }
            }, 0.3)
        }
    }

    onAnimStop(event) {
        // let animState = event.detail;
        let ani
        if (this.animName === 'eatLeft' && event === 'stop') {
            ani = this.aniObj[this._aniType].standLeft
            this.animCtrl.play(ani).repeatCount = Infinity
        }
        if (this.animName === 'eatRight' && event === 'stop') {
            ani = this.aniObj[this._aniType].standRight
            this.animCtrl.play(ani).repeatCount = Infinity
        }
        this.animCtrl.off('stop', this.onAnimStop, this);

    }


    public get state(): number {
        return this._state
    }

    playJump() {
        // if (!this._isJumping) {
        //     let jump = this.runJumpAction()
        //     cc.tween(this.node).then(jump).start()
        // }
        let body = this.node.getComponent(cc.RigidBody)
        if (body.linearVelocity.y == 0) {
            body.linearVelocity = new cc.Vec2(body.linearVelocity.x, this.Velocity * 4)
            this._isJumping = true
        }
    }


    update(dt) {
        let operateUI: operateUI = gameContext.operateUI
        if (operateUI &&!operateUI.canOperate) {
            gameContext.viewSpeed = 0
            let body = this.node.getComponent(cc.RigidBody)
            body.linearVelocity = new cc.Vec2(0, 0)
            return
        }

        if (this.node.x < 20) {
            this.node.x = 20
        } else if (this.node.x > this.node.parent.width - 20) {
            this.node.x = this.node.parent.width - 20
        }
        let body = this.node.getComponent(cc.RigidBody)
        if (gameContext.moveType == 0) {
            gameContext.viewSpeed = 0
        } else {
            body.linearVelocity = new cc.Vec2(0, body.linearVelocity.y)

        }
        // if (this.isMove && this._state != State.standLeft && this._state != State.standRight) {
        //     if (this.node.x < -500) {
        //         this.node.x = -500
        //     } else if (this.node.x > 500) {
        //         this.node.x = 500
        //     } else {
        //         // if (this._dir == this.LEFT) {
        //         //     this.node.x -= this.speed
        //         // } else if (this._dir == this.RIGHT) {
        //         //     this.node.x += this.speed
        //         // }
        //     }
        // }
    }
}
