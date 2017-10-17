(function () {
    $(function () {
        //设置页面高度
        $('body').height($('body')[0].clientHeight);
        //cookie存储openid
        var Request = new Object();
        Request = GetRequest();
        var openidTrue = Request["employeeId"]; //url中获取合伙人id
        var regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[6780]|18[0-9]|14[57])[0-9]{8}$/; //手机号验证
        var regCode = /^\d{4}$/; //验证码验证
        var userName = ''; //获取用户名字
        var userTel = ''; //用户tel
        var codeNum = ''; //验证码
        //点击获取验证码
        $.ajax({
            url: getPort() + 'employee/getEmployeeInfoById',
            data: {
                employeeId: openidTrue
            },
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；
                    $('.say_name').text(data.obj.realName);
                    // window.location.href = './scanOver.html';
                } else if (data.statusCode == 0) {
                    //获取数据失败；
                    layer.open({
                        content: data.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                }
            }
        });


        $('#getCode').on('click', function (e) {
            e.preventDefault();
            userName = $('#docName').val();
            userTel = $('#docTel').val();
            if (userName == '') {
                layer.open({
                    content: '输入姓名不能为空',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            } else if (userTel == '') {
                layer.open({
                    content: '输入手机号不能为空',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            } else if (!regPhone.test(userTel)) {
                layer.open({
                    content: '请输入正确手机号',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            } else {
                getCodeNum(userTel);
            }
        });
        //点击快速登录按钮
        $('#fastBtn').on('click', function () {
            userName = $('#docName').val();
            userTel = $('#docTel').val();
            codeNum = $('#docCode').val();
            if (userName == '') {
                layer.open({
                    content: '输入姓名不能为空',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            } else if (userTel == '') {
                layer.open({
                    content: '输入手机号不能为空',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            } else if (!regPhone.test(userTel)) {
                layer.open({
                    content: '请输入正确手机号',
                    skin: 'msg',
                    time: 2 //2秒后自动关闭
                });
            } else {
                getLogin();
            }
        });
        //取得验证码
        function getCodeNum(phoneNum) {
            $.ajax({
                url: getPort() + 'sendmessage/messageCode',
                data: {
                    'mobilephone': phoneNum
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var num = 60;
                        var timer = setInterval(function () {
                            num--;
                            $('#getCode').text(num + 's').attr('disabled', true);
                        }, 1000);
                        setTimeout(function () {
                            num = 60;
                            clearInterval(timer);
                            $('#getCode').text('重新发送').attr('disabled', false);
                        }, 60000);
                    } else if (data.statusCode == 0) {
                        //获取数据失败；
                        layer.open({
                            content: data.message,
                            skin: 'msg',
                            time: 2 //2秒后自动关闭
                        });
                    }
                }
            });
        }
        //快速登录方法
        function getLogin() {
            $.ajax({
                url: getPort() + 'employee/developDoctor',
                data: {
                    'mobilephone': userTel,
                    'messageCode': codeNum,
                    'employeeId': openidTrue, //合伙人id从哪里获取
                    'name': userName //用户填写的医生名字
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    //获取数据成功；
                    layer.open({
                        content: data.message,
                        skin: 'msg',
                        time: 2 //2秒后自动关闭
                    });
                    setTimeout(function(){
                        window.location.href = './scanOver.html';
                    },2000);
                }
            });
        }
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