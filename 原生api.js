/**
 * Created by 刘凯 on 2016/10/28.
 */

/**
 * 国美金控基础工具类
 */

/**
 *
 * native结果数据返回格式:
 * {
        code: 0,//0成功，1失败
        msg: '请求超时'//失败时候的提示，成功可为空
        data: {}//数据,无数据可以为空
        };
 */

/**
 *H5给native传值的数据格式，json格式
 *{
 *  data:''  H5传给native的值
 *  method：'',调用native方法之后，再调用H5的方法名
 *  isVlaue: boolen  是否需要给H5传值
 *}
 */

// 该数据格式是此方法GOMEUtil.JsBridge(data,callback)的第一个参数,第二个参数是H5接受原生发送过来的数据,可在此方法里面对数据进行处理,数据格式为

/**
 *   H5和原生交互时候的数据格式;
 *   该数据格式可满足以下三种H5和原生的交互方式:
 *   1)H5只是接受数据,不作其它任何的操作,那么数据格式为:
 *       {
 *              nativeMethod: 'nativeMethod',  // 必传
 *               data: {
 *                   method: 'H5CallBackFn',  // H5 需要执行的方法
 *                   isValue: true,         // true:H5需要执行方法 false: H5不需要执行回调方法
 *                   data: ''               // H5发送给Native的数据
 *               }
 *        };
 *   2)H5告诉Nativ需要执行什么Native方法,那么数据格式为:
 *       {
 *              nativeMethod: 'nativeMethod',  // 需要执行Native方法
 *               data: {
 *                   method: '', // H5 需要执行的方法
 *                   isValue: false,         // true:H5需要执行方法 false: H5不需要执行回调方法
 *                   data: ''               // H5发送给Native的数据
 *               }
 *        };
 *   3)H5告诉Nativ需要执行什么Native方法,并且H5告诉Native需要返回什么H5回调方法,那么数据格式为:
 *       {
 *              nativeMethod: 'NativeFn',  // 不需要执行任何Native方法
 *               data: {
 *                   method: 'H5CallBackFn', // H5 需要执行的方法
 *                   isValue: true,         // true:H5需要执行方法 false: H5不需要执行回调方法
 *                   data: ''               // H5发送给Native的数据
 *               }
 *        };
 *
 */

export default function GOMEUtil() {}

/**
 * 检测当前浏览器是否为iPhone(Safari)
 */
GOMEUtil.isIPhone = function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('iPhone') > -1) {
        return true;
    }
    return false;
};
/**
 * 检测当前浏览器是否为Android(Chrome)
 */
GOMEUtil.isAndroid = function() {
    var ua = navigator.userAgent;
    if (ua.indexOf('Android') > -1) {
        return true;
    }
    return false;
};
GOMEUtil.JsBridge = function(data, callback) {
    if (!data) return;
    if (!window.webkit && !window.androidWebView) return;
    if (GOMEUtil.isAndroid()) {
        let jsonStr = JSON.stringify(data);
        window.androidWebView.jsBridge(jsonStr);
        window[data.data.method] = (function(callback) {
            return callback;
        })(callback);
        return false;
    } else if (GOMEUtil.isIPhone()) {
        window.webkit.messageHandlers.utils.postMessage(data);
        window[data.data.method] = (function(callback) {
            return callback;
        })(callback);
        return false;
    }
};
/**
 * 相同的集中封装
 */
/**
 * 获取userInfo
 */
GOMEUtil.gotOptNo = function(gomeutil, that) {
    gomeutil.JsBridge({
        nativeMethod: 'obtainUserInfo',
        data: {
            data: '',
            method: 'getUserInfo',
            isValue: true
        }
    }, function (data) {
        window.localStorage.setItem('userInfo', data);
        that.$store.dispatch('userInfo', data);
    });
};
/**
 * 获取token
 */
GOMEUtil.gotToken = function(gomeutil, that) {
    gomeutil.JsBridge({
        nativeMethod: 'obtainToken',
        data: {
            data: '',
            method: 'getToken',
            isValue: true
        }
    }, function (data) {
        that.$store.dispatch('userInfo', data);
    });
};
/**
 *  获取GPS
 */
GOMEUtil.gotGPS = function(gomeutil, that) {
    gomeutil.JsBridge({
        nativeMethod: 'getGPS',
        data: {
            data: '',
            method: 'getGPSData',
            isValue: true
        }
    }, function (data) {
        /**
         * GPS信息
         */
    });
};
/**
 * 返回原生
 */
GOMEUtil.back2Native = function(gomeutil) {
    gomeutil.JsBridge({
        nativeMethod: 'closePage',
        data: {
            data: '',
            method: '',
            isValue: false
        }
    });
};
/**
 * 返回到原生的登录页面 --- 注销登录
 */
GOMEUtil.back2Sign = function(gomeutil) {
    gomeutil.JsBridge({
        nativeMethod: 'logOut',
        data: {
            data: '',
            method: '',
            isValue: false
        }
    });
};
/**
 * 判断设备是安卓还是ios是安卓返回 01 是ios返回 02
 */
GOMEUtil.isDevice = function () {
    if (GOMEUtil.isAndroid()) {
        return '01';
    } else if (GOMEUtil.isIPhone) {
        return '02';
    }
};
/**
 * 检查更新
 */
GOMEUtil.refreshVersion = function (gomeutil) {
    gomeutil.JsBridge({
        nativeMethod: 'refreshVersion',
        data: {
            data: '',
            method: '',
            isValue: false
        }
    });
};
/**
 * 获取当前版本信息
 * 需要版本号
 */
GOMEUtil.gotVersion = function(gomeutil, that) {
    gomeutil.JsBridge({
        nativeMethod: 'obtainVersion',
        data: {
            data: '',
            method: 'getVersion',
            isValue: true
        }
    }, function (data) {
        that.$store.dispatch('userInfo', data);
    });
};
/**
 * 拍照上传封装 --- 以后可能会用到
 */
GOMEUtil.takePhoto = function (gomeutil, that, param) {
    gomeutil.JsBridge({
        nativeMethod: 'getPhoto',
        data: {
            data: param,
            method: 'mycaddPhoto',
            isValue: true
        }
    }, function (data) {
        /**
         * 照片
         */
    });
};
/**
 * 从相册中选择 --- 以后可能会用到
 */
GOMEUtil.fromFrames = function (gomeutil, that, param) {
    gomeutil.JsBridge({
        nativeMethod: 'selectPhoto',
        data: {
            data: param,
            method: 'mycaddSelectPic',
            isValue: true
        }
    }, function (data) {
        /**
         * 照片
         */
    });
};
/**
 * 公积金贷进件  js2 NATIVE
 */
GOMEUtil.goEurLex = function(gomeutil) {
    gomeutil.JsBridge({
        nativeMethod: 'eurLex',
        data: {
            data: '',
            method: '',
            isValue: false
        }
    });
};
/**
 * 继续办理
 */
GOMEUtil.continue = function(gomeutil, config) {
    gomeutil.JsBridge({
        nativeMethod: 'proceeding',
        data: {
            data: config,
            method: '',
            isValue: false
        }
    });
};
/**
 *  教育分期继续办理
 */
GOMEUtil.continue = function(gomeutil, config) {
    gomeutil.JsBridge({
        nativeMethod: 'educationProceeding',
        data: {
            data: config,
            method: '',
            isValue: false
        }
    });
};
/**
 * 从Native的首页点击 '美易分', Native将已经获取的'进件中','补件中','上传拆封照'这三个的数量传给H5;
 * 用途: 因为这三个数量是两个接口,因此点击Native'美易分'进入H5,将这三个数量传给H5,避免请求两次接口,同时也简化了H5的开发
 */
GOMEUtil.GetPieceCount = function() {
    GOMEUtil.JsBridge({
        nativeMethod: 'nativePieceCount',
        data: {
            data: '',
            method: 'h5PieceCount',
            isValue: true
        }
    }, function(data) {
        window.localStorage.setItem('pieceCount', data);
    });
};
