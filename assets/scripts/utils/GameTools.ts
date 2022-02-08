import PoolUtil from "./PoolUtil";

export interface itemInfo {

  idx: number,
  value: number,
  name: string
}

//:{\"gameNum\":1,\"rank\":3,\"maxscore\":19,\"percent\":\"0.5\"}}"
export interface resultData {
  score: string,
  rank: string,
  percent: number,
  errTipList: string[]

}

var gameContext = {
  soundCache: {}, //声效缓存
  volume: 1, //音量调节
  toastPool: [],
  prefabs: {},
  GameUI: null,
  player:null,
  score: 0,//得分

  isPlayMusic:true,
  isPause:false,

  getPrefabByResName(resName: string, callback?: Function) {
    if (!gameContext.prefabs[resName]) {
      GameTools.load(resName, cc.Prefab, function (err, prefab) {
        if (!err) {
          gameContext.prefabs[resName] = prefab

          callback && callback(prefab), callback = null
        } else {
          console.log(resName)
          cc.log('加载预设失败：', err)
        }
      })
    } else {
      callback && callback(gameContext.prefabs[resName]), callback = null
    }
  },


  showStartTel(data?: itemInfo, callback?: Function) {
    var resName = "prefabs/startTel"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('startTel').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showStartWeCat(data?: itemInfo, callback?: Function, removeOther?: boolean) {
    var resName = "prefabs/startWeCat"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('startWeCat').init(data, callback)
        if (removeOther) {
          gameContext.GameUI.node.getChildByName('otherPanel').removeAllChildren()
        }

        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showPrizeWnd(data?: itemInfo, callback?: Function) {
    var resName = "prefabs/prizeWnd"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('prizeWnd').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showRankWnd(data?: itemInfo, callback?: Function) {
    var resName = "prefabs/rankWnd"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('rankWnd').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },



  showResultWnd(data?: resultData, callback?: Function) {
    var resName = "prefabs/resultWnd"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('resultWnd').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showRuleWnd(data?: itemInfo, callback?: Function) {
    var resName = "prefabs/ruleWnd"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('ruleWnd').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showTelWnd(data?: itemInfo, callback?: Function) {
    var resName = "prefabs/telWnd"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('telWnd').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showZhuliUI(data?: any, callback?: Function) {
    var resName = "prefabs/zuliUI"
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent('zuliUI').init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  // showStartPage(data?: itemInfo, callback?: Function) {
  //   var resName = "prefabs/startPage"
  //   gameContext.getPrefabByResName(resName, (prefab) => {
  //     PoolUtil.getItemShowNode(prefab, (node) => {
  //       node.getComponent('startPage').init(data, callback)
  //       gameContext.GameUI.node.getChildByName('otherPanel').removeAllChildren()
  //       gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
  //     })
  //   });
  // },

  showUI(name: string, data?: itemInfo, callback?: Function) {
    var resName = `prefabs/${name}`
    gameContext.getPrefabByResName(resName, (prefab) => {
      PoolUtil.getItemShowNode(prefab, (node) => {
        node.getComponent(name).init(data, callback)
        gameContext.GameUI.node.getChildByName('otherPanel').removeAllChildren()
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
      })
    });
  },

  showToast(msg, showTime = undefined, pos: cc.Vec2 = undefined) {
    var resName = "prefabs/toastLayer"
    gameContext.getPrefabByResName(resName, (prefab) => {

      PoolUtil.getItemShowNode(prefab, (node) => {
        gameContext.toastPool.forEach(toastNode => {
          if (cc.isValid(toastNode)) {
            toastNode.runAction(cc.moveBy(0.1, 0, 70))
          }
        });
        if (pos == undefined) {
          node.setPosition(cc.v2(0, 200));
        } else {
          node.setPosition(pos);
        }
        if (showTime == undefined) {
          showTime = 2;
        }
        var callfunc = ((destroyNode) => {
          gameContext.toastPool.splice(gameContext.toastPool.indexOf(destroyNode), 1);
        }
        );
        var toastLayer = node.getComponent("ToastLayer")
        toastLayer.showToast(msg, showTime, callfunc);
        // gameContext.GameUI.node.getChildByName('otherPanel').removeAllChildren()
        gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
        gameContext.toastPool.push(node);
      })
    });
  },

  // showTipUI(data: string, callback: Function) {
  //   var resName = "prefabs/tipUI"
  //   gameContext.getPrefabByResName(resName, (prefab) => {
  //     PoolUtil.getItemShowNode(prefab, (node) => {
  //       node.getComponent('tipUI').init(data, callback)
  //       gameContext.GameUI.node.getChildByName('otherPanel').addChild(node);
  //     })
  //   });
  // },


};

export { gameContext };

var gameConfig = {

  foodsData: null,
}
export { gameConfig };

var GameTools = {
  /**
   * 声效管理
   * @param soundPath
   * @param soundType 音频类型：0游戏背景音 1游戏特效
   * @param loop
   * @param cb
   * @param isRelease
   */
  loadSound(
    soundPath: string,
    soundType: number,
    loop: boolean,
    cb: Function = null,
    isRelease: boolean = false
  ) {
    var soundProperty = ["playMusic", "playEffect"][soundType];
    if (gameContext.soundCache[soundPath]) {
      cc.audioEngine[soundProperty](gameContext.soundCache[soundPath], loop);
    } else {
      GameTools.load(soundPath, cc.AudioClip, function (err, res) {
        if (!err) {
          if (isRelease && !loop) {
            var id = cc.audioEngine.play(res, false, gameContext.volume);
            cc.audioEngine.setFinishCallback(id, () => {
              cc.audioEngine.stop(id);
              cc.audioEngine.uncache(res);
              GameTools.release(res);
            });
          } else {
            gameContext.soundCache[soundPath] = res;
            cc.audioEngine[soundProperty](res, loop);
          }

          cb && cb(res);
          cb = null;
        }
      });
    }
  },
  /**
   * 资源加载
   * @param path
   * @param type
   * @param cb
   */
  load(path: string, type, cb: Function) {
    cc.resources.load(path, type || cc.Asset, (err, res) => {
      cb && cb(err, res), (cb = null);
    });
  },
  /**
   * 资源释放
   * @param path
   * @param type
   * @param cb
   */
  release(res: cc.AudioClip) {
    cc.assetManager.releaseAsset(res);
  },

  /***************************************
 * 生成从minNum到maxNum的随机数。
 * 如果指定decimalNum个数，则生成指定小数位数的随机数
 * 如果不指定任何参数，则生成0-1之间的随机数。
 ****************************************/
  randomNum(maxNum, minNum, decimalNum = null) {
    var max = 0,
      min = 0;
    minNum <= maxNum
      ? ((min = minNum), (max = maxNum))
      : ((min = maxNum), (max = minNum));
    switch (arguments.length) {
      case 1:
        return Math.floor(Math.random() * (max + 1));
      case 2:
        return Math.floor(Math.random() * (max - min + 1) + min);
      case 3:
        return (Math.random() * (max - min) + min).toFixed(decimalNum);
      default:
        return Math.random();
    }
  },
  /**
   * 加载图片资源
   * @param resUrl 
   * @param node 
   */
  loadItemIcon(resUrl: string, node: cc.Node) {
    node.getComponent(cc.Sprite).spriteFrame = null;

    GameTools.load(resUrl, cc.SpriteFrame, function (error, spriteFrame) {
      if (!error) {
        if (node && cc.isValid(node)) {
          node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        }
      } else {
        cc.log("icon load error:" + resUrl);
      }
    })
  },
  _getBoundingBoxToWorld(node) {
    var p = cc.isValid(node) ? node.convertToWorldSpaceAR(cc.v2(0, 0)) : cc.v2();
    return cc.rect(p.x, p.y, node.width, node.height);
  },
  /**
   * 两个坐标距离
   * @param p1 
   * @param p2 
   * @returns 
   */
  pDistance(p1, p2) {
    return p1.sub(p2).mag();
  },

  getAngle(start: cc.Vec2, end: cc.Vec2): number {
    let theangle = -Math.atan2(start.y - end.y, start.x - end.x) //弧度  
    let theta = - (theangle * 180 / Math.PI - 90); //角度  
    theta = Math.floor(Math.max(-80, theta))
    theta = Math.floor(Math.min(80, theta))
    return theta
  },

  getBoatPos(idx): cc.Vec2 {
    let points = [{ x: -720, y: 245 }, { x: -241, y: 245 }, { x: 239, y: 245 }, { x: 720, y: 245 },
    { x: -485, y: 55 }, { x: -5, y: 55 }, { x: 475, y: 55 },
    { x: -720, y: -137 }, { x: -72, y: -137 }, { x: 576, y: -137 }]
    let vec = new cc.Vec2(points[idx].x, points[idx].y)
    return vec
  },

  //生成count个小于max的整数
  getRandomNums(count, max): number[] {
    var Arr = [];
    // 声明一个变量并赋值
    var add = 0;
    while (add < count) {
      var num = Math.floor(max * Math.random());
      if (Arr.indexOf(num) == -1) {
        Arr.push(num);
        add++;
      }
      Arr.sort(function (a, b) {
        return b - a;
      })
    }
    return Arr
  },
  /**
 * 
 * @param {*} typeList 数组[1,2,3,22] 或者 [{name:"小梅",age:"22"}]  对象列表或者单元素列表
 * @param {*} tar 22
 * @param {*} key name
 * @param {*} _count 找到对应累计次数
 */
  whichHaveLog(typeList, tar, key?: any, _count?: any) {
    if (!typeList || !Array.isArray(typeList)) return;
    for (let i = 0; i < typeList.length; i++) {
      var element = typeList[i];
      if (!key && element == tar) {
        return true;
      } else if (element[key] == tar) {
        if (_count) element[_count] += 1;
        return String(i);
      };
    };
    return false;
  },
  destroyNode(node) {
    if (node && cc.isValid(node)) {
      if (node.childrenCount > 0) {
        var children = node.children;
        children.forEach(child => {
          this.destroyNode(child);
        });
      };
      node.destroy();
    };
  },
  getUrlParam(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) {
      return unescape(r[2]);
    }
    return null;
  }
};


export default GameTools;