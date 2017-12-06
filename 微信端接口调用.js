//调用微信获取用户信息
export function getUserinfo() {
  var url = window.location.href.split("#")[0];
  $.ajax({
    type: "POST",
    url: "https://jie.gomemyf.com/jie-api/weixin/wxsign.do",
    data: "wxsign_url=" + encodeURIComponent(url),
    dataType: "json",
    error: function(request) {
      console.log("请求失败！");
    },
    success: function(data) {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: data.timestamp, // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: [
            'hideOptionMenu',
            'checkJsApi',
            'getNetworkType',
            'getLocation'
          ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
      wx.checkJsApi({
        jsApiList: [
          'closeWindow',
          'hideOptionMenu',
          'getNetworkType',
          'getLocation'
        ],
        success: function(res) {
          if (res.checkResult.getLocation == false) {
            alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
            return;
          }
        }
      });
      wx.ready(function() {
        //关闭分享接口
        wx.hideOptionMenu();
        //获取网络状态
        wx.getNetworkType({
          success: function(res) {
            sessionStorage.setItem("networkType", res.networkType);
            // var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
          }
        });
        //获取地理位置
        wx.getLocation({
          type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
          success: function(res) {
            // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            sessionStorage.setItem("latitude", res.latitude);
            sessionStorage.setItem("longitude", res.longitude);
            //通过经纬度获取详细地理位置信息
            $.ajax({
              type: "POST",
              // url : "http://restapi.amap.com/v3/geocode/regeo?location="+ res.longitude +","+ res.latitude +"&extensions=base&output=json&key=d3f96f20591bcc91fb84d7f2cb30525a"
              url: "https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + res.latitude + "," + res.longitude + "&output=json&pois=1&ak=RNMUSF148Ur9bDHDiNdAtGaiREmYLoh7&s=1",
              dataType: "JSONP",
              error: function(request) {
                console.log("请求失败！");
              },
              success: function(data) {
                var address = data.result.addressComponent.country + data.result.addressComponent.province + data.result.addressComponent.city + data.result.addressComponent.district + data.result.addressComponent.street + data.result.addressComponent.street_number;
                sessionStorage.setItem("address", address);
                // console.log(address);
                // alert(address);
              }
            });
          }
        });
      });
    }
  });
}