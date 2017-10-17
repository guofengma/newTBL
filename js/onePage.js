(function () {
    $(function () {
        //cookie存储openid
        var Request = new Object();
        Request = GetRequest();
        var openidTrue = Request["openid"];
        var paramTrue = Request['param'];
        setCookie('openid',openidTrue);
        setCookie('param',paramTrue);
        var lastUrl = '?openid='+openidTrue+'&param='+paramTrue;
        //调用ajax
        $.ajax({
            url: getPort() + 'employee/getEmployeeInfo',
            data: {
                openId: openidTrue
            },
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //缓存用户id和姓名
                    setCookie('id',data.obj.id);
                    setCookie('realName',data.obj.realName);
                    setCookie('mobilephone',data.obj.mobilephone);
                    setCookie('department',data.obj.department);
                    setCookie('createTime',data.obj.createTime);
                    //获取数据成功，表示该用户已经存在；直接跳转到点击的对应页面
                    if (paramTrue == 'addDoctor') {
                        window.location.href = './addDocCode.html' + lastUrl//添加医生 
                    } else if (paramTrue == 'doctorList') {
                        // window.location.href = './queryList.html' + lastUrl//医生列表
                        if(data.obj.weight==102) {//合伙人权限
                            window.location.href = './qiuZhangStat.html';
                        }else {
                            window.location.href = './queryList.html?id='+data.obj.id;
                        }
                    } else if (paramTrue == 'resultStatistics') {
                        window.location.href = './monCount.html' + lastUrl//积分统计
                    } else if (paramTrue == 'cashRecord') {
                        window.location.href = './monLog.html' + lastUrl//提现记录
                    } else if(paramTrue == 'resultRule') {
                        window.location.href = './taobiRules.html' + lastUrl//套币规则
                    } else if(paramTrue == 'basicInfo') {
                        window.location.href = './baseInfo.html' + lastUrl//基本信息
                    }else if(paramTrue == 'inviteFriends') {
                        window.location.href = './developFriend.html' + lastUrl//推荐好友
                    }
                } else if (data.statusCode == 0) {
                    //表示用户不存在，跳转到注册页面；
                    window.location.href = './login.html' + lastUrl;
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