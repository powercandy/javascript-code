// 判断是否在微信端打开及手机类型：
var u = navigator.userAgent;  
    if (is_weixin() && u.indexOf('Android') > -1) {//安卓手机  
        // do something
    } else if(is_weixin() && u.indexOf('Linux') > -1){//安卓手机  
        // do something
    }else if(is_weixin() && u.indexOf('iPhone') > -1){//苹果手机  
        // do something
    }else if (u.indexOf('Windows Phone') > -1) {//winphone手机  
        // do something
    }  
//是否在微信内打开  
function is_weixin() {  
    var ua = navigator.userAgent.toLowerCase();  
        if (ua.match(/MicroMessenger/i) == "micromessenger") {  
            return true;  
        } else {
            return false;  
        }
}  