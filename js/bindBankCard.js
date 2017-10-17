(function () {
    $(function () {
        $('#bankUser').val(getCookie('realName'));
        $('#bankText').val(getCookie('bankName'));
        //选择银行卡
        $('#bankText').on('click', function () {
            window.location.href = './bankList.html'
        });
        var regBank = /^\d{16}|\d{19}$/;
        //点击绑定按钮
        $('#sure_bind').on('click', function () {
            var bankNum = $('#bankNum').val();
            var bankNumTrue = regBank.test(bankNum);
            if (!bankNumTrue) {
                layer.open({
                    content: '请输入正确的银行卡卡号'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
                $('#bankNum').focus();
                return false;
            } else if ($('#bankInfo').val() == '') {
                layer.open({
                    content: '开户行信息不能为空'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
                $('#bankInfo').focus();
                return false;
            } else {
                bindBank();
            }
        });
        //绑定银行卡
        function bindBank() {
            var dataList = {
                'employeeId':getCookie('id'),
                'realName':getCookie('realName'),
                'bankId':getCookie('bankId'),
                'bankCardNumber':$('#bankNum').val(),
                'bankAddress':$('#bankInfo').val()
            }
            $.ajax({
                url: getPort() + 'employee/addBankCard',
                data:dataList,
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；提示信息
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