(function () {
    $(function () {
        $.ajax({
            url: getPort() + 'employee/getBanks',
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；
                    var banks = data.list;
                    var strList = '<li bankId="'+banks[0].id+'">'
                        + '<img src="./imgs/nongye.png" alt="">'
                        + '<p>'+banks[0].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[1].id+'">'
                        + '<img src="./imgs/jianshe.png" alt="">'
                        + '<p>'+banks[1].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[2].id+'">'
                        + '<img src="./imgs/zhonguoyinhang.png" alt="">'
                        + '<p>'+banks[2].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[3].id+'">'
                        + '<img src="./imgs/gongshangyinhang.png" alt="">'
                        + '<p>'+banks[3].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[4].id+'">'
                        + '<img src="./imgs/youzheng.png" alt="">'
                        + '<p>'+banks[4].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[5].id+'">'
                        + '<img src="./imgs/zhongxin.png" alt="">'
                        + '<p>'+banks[5].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[6].id+'">'
                        + '<img src="./imgs/minsheng.png" alt="">'
                        + '<p>'+banks[6].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[7].id+'">'
                        + '<img src="./imgs/guangda.png" alt="">'
                        + '<p>'+banks[7].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[8].id+'">'
                        + '<img src="./imgs/zhaoshang.png" alt="">'
                        + '<p>'+banks[8].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[9].id+'">'
                        + '<img src="./imgs/xingye.png" alt="">'
                        + '<p>'+banks[9].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[10].id+'">'
                        + '<img src="./imgs/pufa.png" alt="">'
                        + '<p>'+banks[10].bankname+'</p>'
                        + '</li> '
                        + '<li bankId="'+banks[11].id+'">'
                        + '<img src="./imgs/beijing.png" alt="">'
                        + '<p>'+banks[11].bankname+'</p>'
                        + '</li>'
                        + '<li bankId="'+banks[12].id+'">'
                        + '<img src="./imgs/huaxia.png" alt="">'
                        + '<p>'+banks[12].bankname+'</p>'
                        + '</li>'
                        + '<li bankId="'+banks[13].id+'">'
                        + '<img src="./imgs/shenzhenfazhan.png" alt="">'
                        + '<p>'+banks[13].bankname+'</p>'
                        + '</li>'
                    $('.list_box').html(strList);
                    $('.list_box>li').on('click',function(){
                        /**
                         * cookie银行名称和银行id
                         */
                        setCookie('bankName',$(this).find('p').text());
                        setCookie('bankId',$(this).attr('bankId'));
                        window.location.href = './bindBankCard.html';
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
    });
})();