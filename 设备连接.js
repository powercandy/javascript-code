封装方法：
    connectWebViewJavascriptBridge(callback) {
        // 来源字段为formChannel，来判断来自哪个第三方。判断调用哪个方法 -- zj
        let fromChannel = sessionStorage.getItem('fromChannel');
        // 数组存放第三方简称 -- zj
        let arr = ['tianxxy', 'wold', 'liandfx'];
        if (arr.indexOf(fromChannel) > -1) {
            return callback(access);
        } else {
            if (window.GomeBridge) {
                return callback(window.GomeBridge);
            } else {
                document.addEventListener('GomeBridgeReady', function () {
                    callback(window.GomeBridge);
                }, false);
            }
            if (window.WVJBCallbacks) {
                return window.WVJBCallbacks.push(callback);
            }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'gomescheme://__BRIDGE_LOADED__';
            // WVJBIframe.src = 'gomefinancescheme://__BRIDGE_LOADED__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function () {
                document.documentElement.removeChild(WVJBIframe);
            }, 0);
        }
 	   }

    /**
     * JS与原生APP通讯桥梁
     * @param callback  {[Function]}    [具体交互方法]
     * 实现调用：
     * connectWebViewJavascriptBridge((bridge) => {
 *       // js注册 app调用， 参数1 与app同步方法名   参数2.1 app调用js入参   参数2.2 js回应app callback方法
 *       bridge.registerHandler('gome_get_title', (data, responseCallback) => {responseCallback(responseData)})
 *       // app注册 js调用， 参数1 与app同步方法名   参数2 js调用app入参   参数3 app回应js callback方法
 *       bridge.callHandler('gome_send_token', null, (response) => {接收app参数，以及之后实现})
 * })
     */


 // 调用功能
    callHandler(name, params, callback2) {
        let fromChannel = sessionStorage.getItem('fromChannel');
        if (name === 'gome_getphoto') {
            // 这里调用拍照
            switch (fromChannel) {
                case 'tianxxy':
                    this.PYjsBridgeSnap(callback2);
                    break;
                case 'wold':
                    this.welabSnap(callback2);
                    break;
                case 'liandfx':
                    this.lianDfq(callback2);
                    break;
            }
        }
        if (name === 'gome_getgps') {
            // 这里调用定位
            switch (fromChannel) {
                case 'tianxxy':
                    this.PYjsBridgeGPS(callback2);
                    break;
                case 'wold':
                    this.welabGPS(callback2);
                    break;
                case 'liandfx':
                    this.lianDfqLocation(callback2);
                    break;
            }
        }
    }