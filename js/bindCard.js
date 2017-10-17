(function () {
    $(function () {
        var regCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
        //点击绑定按钮
        $('#sureBind').on('click', function (e) {
            e.preventDefault();
            var cardNum = $('#cardNum').val();
            console.log(cardNum);
            var cardTrue = regCard.test(cardNum);
            if (!cardTrue) {
                layer.open({
                    content: '请输入正确身份证号'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
                return false;
            } else {
                bindMyCard();
            }
        });
        function bindMyCard() {
            $.ajax({
                url: getPort() + 'employee/addCardId',
                data: {
                    'openId': getCookie('openid'),
                    'cardId': $('#cardNum').val()
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        layer.open({
                            content: data.message
                            , btn: '我知道了'
                            , yes: function () {
                                window.location.href = './baseInfo.html'
                            }
                        });
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
        }
    });
})();