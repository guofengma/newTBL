(function () {
    $(function () {
        var canCharge = '';//设置可提现全局
        var hadMonTrue = false;//判断当月是否已经体现
        $.ajax({
            url: getPort() + 'scorecharge/getScoreAndChargeFinal',
            data: { 'employeeId': getCookie('id') },
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；
                    var dataInfo = data.obj;
                    canCharge = dataInfo.scoreCancharge;
                    var strHead = '<p>可提现涛币 （T）</p>'
                        + '<p>' + dataInfo.scoreCancharge + ' &nbsp;&nbsp;<span>合计： &nbsp;T ' + dataInfo.scoreNow + '</span></p>'
                        + '<p>未入账涛币 （T）</p>'
                        + '<p>' + dataInfo.scoreUncharge + '</p>';
                    $('.mon_head').html(strHead);
                    $('.all_money').text(dataInfo.scoreFinal);
                    $('.had_money').text(dataInfo.scoreChargeFinal);
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
        $.ajax({
            url: getPort() + 'scorecharge/isScoreCharge',
            data:{
                employeeId:getCookie('id')
            },
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；

                } else if (data.statusCode == 0) {
                    //获取数据失败；
                    hadMonTrue = true;
                    layer.open({
                        content: data.message
                        , skin: 'msg'
                        , time: 2 //2秒后自动关闭
                    });
                }
            }
        });
        //点击提现按钮
        $('#getMoney').on('click', function () {
            var myMoney = $('#monNum').val();
            if (hadMonTrue) {
                layer.open({
                        content: '您当月已提过现，不能再次提现'
                        , skin: 'msg'
                        , time: 2 //2秒后自动关闭
                });
            } else if (myMoney < 5000) {
                layer.open({
                    content: '输入提现涛币不小于5000'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if (myMoney > canCharge) {
                layer.open({
                    content: '您输入涛币超出您可提现涛币范围'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if (myMoney % 100 != 0) {
                layer.open({
                    content: '您输入提现涛币要是100的整数'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if(canCharge < 5000) {
                layer.open({
                    content: '您当前可提现涛币小于5000'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            }else {
                getGoMoney();
            }
        });
        //提现请求
        function getGoMoney() {
            $.ajax({
                url: getPort() + 'scorecharge/saveScoreCharge',
                data: {
                    'employeeId': getCookie('id'),
                    'score': $('#monNum').val()
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        /**
                         * 提示用户信息
                         */
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