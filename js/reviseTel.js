(function () {
    $(function () {
        var regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[6780]|18[0-9]|14[57])[0-9]{8}$/;//手机号验证
        $('#telNum').text(getCookie('mobilephone'));
        //弹窗2的弹出内容
        var strLayerTwo = '<p class="sendTel">已向<span>' + getCookie('mobilephone') + '</span>手机号发送验证码</p>'
            + '<form>'
            + '<input type="tel" id="oneNum" class="codeNum">'
            + '<input type="tel" id="twoNum" class="codeNum">'
            + '<input type="tel" id="threeNum" class="codeNum">'
            + '<input type="tel" id="fourNum" class="codeNum">'
            + '</form>';
        //弹窗2输入框自动跳转到下一个
        $('body').on('keyup', '.codeNum', function (e) {
            if (e.keyCode != 8) {
                $(this).next('input').focus();
            }
        });
        //弹窗3弹出的内容
        var strLayerThree = '<p>请输入未注册的新手机号</p>'
            + '<form class="getNewTel">'
            + '<input type="tel" id="reviseTelNum">'
            + '</form>';
        //点击第一个弹窗（警示）
        $('#reviseTel').on('click', function () {
            layer.open({
                title: [
                    '警示',
                    'background-color:#fff; color:#e02112;font-size:.9rem;line-height:2.5rem;height:2.5rem;'
                ]
                , content: '<p>只支持修改到未注册的手机号</p><p>修改后必须用新手机号登录</p>'
                , btn: ['我知道了']
                , yes: function () {
                    //点击我知道了获取验证码；
                    $.ajax({
                        url: getPort() + 'sendmessage/messageCode',
                        data: { mobilephone: getCookie('mobilephone') },
                        dataType: 'json',
                        type: 'POST',
                        success: function (data) {
                            //第二个弹窗（输入验证码）
                            if (data.statusCode == 1) {
                                layer.open({
                                    title: [
                                        '请输入验证码',
                                        'background-color:#fff; color:#036eb8;font-size:.9rem;line-height:2.5rem;height:2.5rem;'
                                    ]
                                    , content: strLayerTwo
                                    , btn: ['下一步']
                                    , yes: function () {
                                        //获取用户输入验证码
                                        var userCode = $('#oneNum').val() + $('#twoNum').val() + $('#threeNum').val() + $('#fourNum').val();
                                        console.log(userCode);
                                        //第三个弹窗(验证通过，修改手机号)
                                        layer.open({
                                            title: [
                                                '更换手机号',
                                                'background-color:#fff; color:#036eb8;font-size:.9rem;line-height:2.5rem;height:2.5rem;'
                                            ]
                                            , content: strLayerThree
                                            , btn: ['下一步']
                                            , yes: function () {
                                                //需要修改的手机号码;
                                                var sureTelNum = $('#reviseTelNum').val();
                                                if (regPhone.test(sureTelNum)) {
                                                    $.ajax({
                                                        url: getPort() + 'employee/updateMobilephone',
                                                        data: {
                                                            openId: getCookie('openid'),
                                                            NewPhone: sureTelNum,
                                                            messageCode: userCode
                                                        },
                                                        type: 'POST',
                                                        dataType: 'json',
                                                        success: function (data) {
                                                            console.log(data);
                                                            if (data.statusCode == 1) {
                                                                //第四个弹出（提示手机号修改成功）;
                                                                layer.open({
                                                                    content: '<p><br /><br /></p>' + data.message + '<p><br /></p>'
                                                                    , btn: '我知道了'
                                                                    , yes: function () {
                                                                        //修改手机号成功，重新缓存合伙人手机号    
                                                                        setCookie('mobilephone', sureTelNum);
                                                                        //跳转至登录页面
                                                                        window.location.href = './baseInfo.html';
                                                                    }
                                                                });
                                                            } else if (data.statusCode == 0) {
                                                                layer.open({
                                                                    content: '<p><br /><br /></p>' + data.message + '<p><br /></p>'
                                                                    , btn: '我知道了'
                                                                });
                                                            }
                                                        }
                                                    });
                                                } else {
                                                    layer.closeAll();
                                                    layer.open({
                                                        content: '<p><br /><br /></p>请输入正确的手机号码<p><br /></p>'
                                                        , btn: '我知道了'
                                                        , yes: function () {
                                                            window.history.go(0);
                                                        }
                                                    });
                                                }

                                            }
                                        });
                                    }
                                });
                            } else if (data.statusCode == 0) {
                                layer.open({
                                    content: data.message
                                    , skin: 'msg'
                                    , time: 2 //2秒后自动关闭
                                });
                            }
                        }
                    });
                }
            });
        });
    });
})();



