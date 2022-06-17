//是否打开日志
let OPENLOGFLAG = true;
export class Logger {
 
    /**
     * 获取打印这条日志的事件
     * @returns {string} 返回[年-月-日 时:分:秒]格式
     */
    private static getDateString(): string {
        let d = new Date();
        let timeStr = "";
        let str = String(d.getFullYear());
        timeStr += str + "-";
        str = String(d.getMonth());
        timeStr += str + "-";
        str = String(d.getDay());
        timeStr += str + " ";
        str = String(d.getHours());
        timeStr += (str.length==1? "0"+str : str) + ":";
        str = String(d.getMinutes());
        timeStr += (str.length==1? "0"+str : str) + ":";
        str = String(d.getSeconds());
        timeStr += (str.length==1? "0"+str : str) + "";
        timeStr = "[" + timeStr + "]";
        return timeStr;
    }
 
    /**
     * 在堆栈中定位错误或者信息
     * @param index 定位的第几处错误
     * @returns 将定位的位置以类名+错误所在的位置输出
     */
    private static stack(index): string {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach(function (line) {
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            } else {
                result.push({ [lineBreak[0]]: lineBreak[1] });
            }
        });
 
        var list = [];
        if (index < result.length - 1) {
            for (var a in result[index]) {
                list.push(a);
            }
        }
        var splitList = list[0].split(".");
        return (splitList[0] + ".ts->" + splitList[1] + ": ");
    }
 
    /**
     * 日志
     * @param args 参数
     */
    public static log(...args) {
        var backLog = console.log || cc.log
        if (OPENLOGFLAG) {
            backLog.call(this, "%s%s:" + cc.js.formatStr.apply(cc, arguments), Logger.stack(2), Logger.getDateString());
        }
    }
 
    /**
     * 信息
     * @param args 参数
     */
    public static info(...args) {
        var backLog = console.log || cc.log
        if (OPENLOGFLAG) {
            backLog.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:#66FFFF;", Logger.stack(2), Logger.getDateString());
        }
    }
 
    /**
     * 警告
     * @param args 参数
     */
    public static warn(...args) {
        var backLog = console.log || cc.log
        if (OPENLOGFLAG) {
            backLog.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:#ee7700;", Logger.stack(2), Logger.getDateString());
        }
    }
 
    /**
     * 错误
     * @param args 参数
     */
    public static err(...args) {
        var backLog = console.log || cc.log
        if (OPENLOGFLAG) {
            backLog.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:red", Logger.stack(2), Logger.getDateString());
        }
    }
}