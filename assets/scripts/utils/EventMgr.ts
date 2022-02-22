// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventMgr extends cc.Component {

    private dic = {};

    public static CLOSEOPERATE: string = 'closeOperate'
    public static OPENOPERATE: string = 'openOperate'

    /**展示记忆宝典详情 */
    public static SHOWMEMRY: string = 'showmemory'

    /**更新血条 */
    public static UPDATESAN: string = 'updateSan'
    public static TOUCHMASK: string = 'touchMask'
    public static TOUCHVIRUS: string = 'touchVirus'
    public static TOUCHFINISH: string = 'touchFinish'
    /**碰撞荆棘 */
    public static TOUCHTHORNS: string = 'touchthorns'
    /**碰撞酒瓶 */
    public static TOUCHBOTTLE: string = 'touchbottle'
    /**碰撞酒桶 */
    public static TOUCHBERRL: string = 'touchberrl'
    /**碰撞食物 */
    public static TOUCHFOOD: string = 'touchfood'

    /**碰撞蝙蝠 */
    public static TOUCHBAT: string = 'touchbat'
    /**碰撞蝙蝠超声波 */
    public static TOUCHWAVE: string = 'touchwave'
    /**触碰小羊 */
    public static TOUCHSHEEP: string = 'touchsheep'

    /**触碰装修怪 */
    public static TOUCHTANK: string = 'touchTank'


    /**触碰装修怪手臂 */
    public static TOUCHTANKARM: string = 'toucharm'

    /**食物落地 */
    public static FOODGROUND: string = 'foodground'

    /**食物砸到玩家 */
    public static FOODGPLAYER: string = 'foodplayer'

    public static TOUCHBULLET:string = 'bullet'



    public static RESTART: string = 'restart'

    public static MISSSTONE:string = 'stone'
    public static MISSSMILK:string = 'milk'
    public static MISSSYUYANG:string = 'yueyang'
    public static MISSSMUSEUM:string = 'museum'
    public static MISSSSTAB:string = 'stab'
    public static MISSSSFLY:string = 'fly'

    protected static instance: EventMgr;
    public static getInstance(): EventMgr {
        if (!this.instance) {
            this.instance = new EventMgr();
        }
        return this.instance;
    }

    registerListener(typeName: string, cc: cc.Component, action: Function) {
        this.clearSingleRegister(typeName);
        if (!this.dic[typeName]) {
            this.dic[typeName] = [];
        }
        this.dic[typeName].push({ cc: cc, action: action });
    }

    unRegisterListener(typeName: string, cc: cc.Component) {
        this.clearSingleRegister(typeName);
        if (!this.dic[typeName]) return;
        this.dic[typeName].splice(this.dic[typeName].indexOf(cc), 1);
    }

    clearSingleRegister(typeName: string) {
        if (this.dic[typeName]) {
            for (let i = this.dic[typeName].length - 1; i >= 0; i--) {
                if (!this.dic[typeName][i].cc.node) {
                    this.dic[typeName].splice(i, 1);
                }
            }
        }
    }

    sendListener(typeName: string, obj?: any) {
        this.clearSingleRegister(typeName);
        if (this.dic[typeName]) {
            for (let i = 0; i < this.dic[typeName].length; i++) {
                if (this.dic[typeName][i].cc.node) {
                    this.dic[typeName][i].action(this.dic[typeName][i].cc, obj);
                }
            }
        }
    }
}

