// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { gameContext } from "./utils/GameTools";

const { ccclass, property } = cc._decorator;

export enum State {
    standLeft,
    standRight,
    walkLeft,
    walkRight,
    jumpLeft,
    jumpRight,
    fight,
}


@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    public _state: number = 0

    private _isJumping: boolean = false

    isMove: Boolean = false//主角是否真实运动，在场景两边时主角移动，场景中间时场景移动

    private readonly Velocity = 150

    private readonly Speed = 5

    private aniObj = {}
    // public aniType = "normal"

    private _aniType = null

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
        if (this._isJumping) return
        let body = this.node.getComponent(cc.RigidBody)
        let preState = this._state
        this._state = value

        let ani = ''
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
            if (this.isMove) {
                if (gameContext.moveType == 0) {
                    body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
                } else {
                    gameContext.viewSpeed = -this.Speed
                }
            }
            this.playJump()
        } else if (this._state == State.jumpRight) {
            ani = this.aniObj[this._aniType].jumpRight
            if (this.isMove) {
                if (gameContext.moveType == 0) {
                    body.linearVelocity = new cc.Vec2(this.Velocity, 0)
                } else {
                    gameContext.viewSpeed = -this.Speed
                }
            }
            this.playJump()
        } else if (this._state == State.walkLeft) {
            ani = this.aniObj[this._aniType].walkLeft

            this.isMove = true
            if (gameContext.moveType == 0) {
                body.linearVelocity = new cc.Vec2(-this.Velocity, 0)
            } else {
                gameContext.viewSpeed = -this.Speed
            }
        } else if (this._state == State.walkRight) {
            ani = this.aniObj[this._aniType].walkRight
            repeatCount = Infinity
            this.isMove = true
            if (gameContext.moveType == 0) {
                body.linearVelocity = new cc.Vec2(this.Velocity, 0)
            } else {
                gameContext.viewSpeed = this.Speed
            }
        } else if (this._state == State.standLeft) {
            this.isMove = false
            ani = this.aniObj[this._aniType].standLeft
            repeatCount = Infinity
            body.linearVelocity = new cc.Vec2(0, 0)
            gameContext.viewSpeed = 0
        } else if (this._state == State.standRight) {
            // this.node.getComponent(cc.Animation).stop()
            // this._dir = this.RIGHT
            this.isMove = false
            ani = this.aniObj[this._aniType].standRight
            repeatCount = Infinity
            body.linearVelocity = new cc.Vec2(0, 0)
            gameContext.viewSpeed = 0
        }
        if (ani) {
            this.node.getComponent(cc.Animation).play(ani).repeatCount = repeatCount
            console.log('播放：' + ani)
        }
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

        if (this.node.x < 20) {
            this.node.x = 20
        } else if (this.node.x > this.node.parent.width - 20) {
            this.node.x = this.node.parent.width - 20
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
