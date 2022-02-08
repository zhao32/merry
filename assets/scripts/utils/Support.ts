import { gameContext } from "./GameTools";
import httpUtil from "./httpUtil";

var Support = {
  serverAPI: "https://151api.vip.hnhxzkj.com",
  siteid: 159,

  /**
   * onStart或onLoad时执行一次
   */
  request() {
    var arrayList = [
      {
        url: `${Support.serverAPI}/Login/getWxConfig?url=${btoa(
          /**btoa(str):创建一个'base-64'编码的字符串 */
          location.href
        )}`,
        requestMethod: "get",
        method: "getWxConfig",
      },
      {
        //扣次数
        url: `${Support.serverAPI}/Put/putComments`,
        requestMethod: "post",
        method: "putComments",
      },
      {
        //抽奖
        url: `${Support.serverAPI}/Put/lottery1`,
        requestMethod: "post",
        method: "lottery1",
      },
      {
        //分享
        url: `${Support.serverAPI}/Query/setHelp`,
        requestMethod: "get",
        method: "setHelp",
      },
    ];

    arrayList.forEach((requestInfo) => {
      //token
      Support[requestInfo.method] = (data, cb) => {
        httpUtil[requestInfo.requestMethod](
          requestInfo.url,
          data,
          (success) => {
            cb && cb(JSON.parse(success)), (cb = null);
          },
          (fail) => {
            console.error("请求失败：" + JSON.stringify(fail));
          }
        );
      };
    });

    // 模拟用例：
    // Support["setHelp"]({i}, (msg) => {});
  },
  getTicket(msg) {
    var { url, appId, timestamp, nonceStr, signature } = msg.info;
    if (!window["wx"]) {
      return;
    }
    window["wx"].config({
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: appId, // 必填，公众号的唯一标识
      timestamp: timestamp, // 必填，生成签名的时间戳
      nonceStr: nonceStr, // 必填，生成签名的随机串
      signature: signature, // 必填，签名
      jsApiList: [
        "updateAppMessageShareData", //好友
        "updateTimelineShareData", //空间&朋友圈
        "onMenuShareTimeline",
        "onMenuShareAppMessage",
        "showAllNonBaseMenuItem",
        "showMenuItems",
      ], // 必填，需要使用的JS接口列表
    });

    var shareConfig = Support.shareConfig();
    window["wx"].ready(function () {
      window["wx"].updateAppMessageShareData(shareConfig);
      window["wx"].updateTimelineShareData(shareConfig);
      window["wx"].onMenuShareTimeline(shareConfig);
      window["wx"].onMenuShareAppMessage(shareConfig);
      window["wx"].showAllNonBaseMenuItem();
      window["wx"].showMenuItems({
        menuList: ["menuItem:share:appMessage", "menuItem:share:timeline"], // 要显示的菜单项，所有menu项见附录3
      });
    });
    window["wx"].error(function (res) {
      console.log("share_res:", res);
    });
  },
  shareConfig() {
    return {
      title: "雪宝接福", // 分享标题
      desc: "快来一起接福赢一元券，畅游庐山吧！", // 分享描述
      link: "http://118.vip.hnhxzkj.net", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: "http://game13.vip.hnhxzkj.com/avatar.jpg", // 分享图标
      success: function () {
        Support.shareSuccess();
      },
    };
  },
  shareSuccess() {
    Support["setHelp"]({ isNeedToken: true }, (msg) => {
      if (!msg.msgCode) {
        gameContext.showToast("分享成功");
        cc.sys.localStorage.setItem("GAMETIMES", msg.info.gameNum);
      } else {
        // gameContext.showToast(msg.msg);
      }
    });
  },
};
export default Support;
