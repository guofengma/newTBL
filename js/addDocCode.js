(function () {
  $(function () {
    var Request = new Object();
    Request = GetRequest();
    var openidTrue = Request["openid"];
    setCookie('openid',openidTrue);
    $.ajax({
      url: getPort() + 'employee/getEmployeeInfo',
      data: { 'openId': getCookie('openid') },
      dataType: 'json',
      type: 'POST',
      success: function (data) {
        console.log(data);
        if (data.statusCode == 1) {
          //获取数据成功；获取显示二维码
          /**
           * 图片暂时无法显示
           */
          setCookie('id', data.obj.id);
          setCookie('realName', data.obj.realName);
          setCookie('mobilephone', data.obj.mobilephone);
          setCookie('department', data.obj.department);
          setCookie('createTime', data.obj.createTime);
          $('#getCode').attr('src', 'http://www.tdaifu.cn:8090/taodoctor' + data.obj.qrcode);
        } else if (data.statusCode == 0) {
          //获取数据失败；
          layer.open({
            content: data.message
            , skin: 'msg'
            , time: 2 //2秒后自动关闭
          });
        }
      }
    });
    //获取url参数
    function GetRequest() {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
            }
        }
        return theRequest;
    }
  });
})();