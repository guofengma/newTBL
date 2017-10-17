(function () {
  $(function () {
    $.ajax({
      url: getPort() + 'employee/getEmployeeInfo',
      data: {
        'openId': getCookie('openid')
      },
      dataType: 'json',
      type: 'POST',
      success: function (data) {
        console.log(data);
        if (data.statusCode == 1) {
          //获取数据成功；
          var userInfo = data.obj;
          $('.name').text(userInfo.realName);
          $('.phone').text(userInfo.mobilephone);
          userInfo.headerImage ? $('#headImg').attr('src', 'http://www.tdaifu.cn:8090/taodoctor/' + userInfo.headerImage) : $('#headImg').attr('src', './imgs/information_logo.png');
          //判断用户是否已绑定身份证信息
          if (!userInfo.cardId) { //用户身份证不存在
            $('.card').text('点击添加');
            $('#userCard').on('click', function () {
              window.location.href = './bindCard.html'
            });
          } else {
            var cardNum = userInfo.cardId;
            var hadCard = cardNum.replace(/^(.{4})(?:\d+)(.{4})$/, "$1************$2");
            $('.card').text(hadCard).next('i').hide();
          }
          if (!userInfo.department) {
            //用户未认证
            $('.di_ban').text('点击绑定');
            $('#userZbt').on('click',function(){
              window.location.href = './zbtBaseInfo.html'
            });
          } else {
            getDiBan();
          }
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
    //点击手机号跳转修改手机号页面
    $('#userTel').on('click', function () {
      window.location.href = './reviseTel.html'
    });
    getMyList();
    //请求银行卡信息
    function getMyList() {
      $.ajax({
        url: getPort() + 'employee/getBankCards',
        data: {
          'employeeId': getCookie('id')
        },
        dataType: 'json',
        type: 'POST',
        success: function (res) {
          console.log(res);
          if (res.statusCode == 1) {
            //获取数据成功；已绑定银行卡
            var bankNum = res.list[0].cardNumber;
            var hadBankCard = bankNum.replace(/^(.{4})(?:\d+)(.{4})$/, "$1************$2");
            $('.bank_num').text(hadBankCard).next('i').hide();
          } else if (res.statusCode == 0) {
            //获取数据失败；还未绑定银行卡
            $('.bank_num').text('点击添加');
            $('#userBank').on('click',function(){
              window.location.href = './bindBankCard.html';
            });
          }
        }
      });
    }

    //获取地办信息
    function getDiBan() {
      $.ajax({
        url: getPort() + 'employee/getDepartmentInfo',
        data: {
          'departmentCode': getCookie('department')
        },
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          console.log(data);
          if (data.statusCode == 1) {
            var diBanStr = data.obj['dept1'] + '-' + data.obj['dept2'] + '-' + data.obj['dept3'];
            $('.di_ban').text(diBanStr).next('i').hide();
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

  });
})();