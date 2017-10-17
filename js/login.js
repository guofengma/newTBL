(function () {
  $(function () {
    //得到缓存数据param
    var paramTrue = getCookie('param');
    //设置页面高度
    $('body').height($('body')[0].clientHeight);
    var regPhone = /^(0|86|17951)?(13[0-9]|15[012356789]|17[356780]|18[0-9]|14[57])[0-9]{8}$/;//手机号验证
    var regCode = /^\d{4}$/;//验证码验证
    var allProvinces = {};//所有省份
    var allCitys = {};//所有市区
    var allCode = '';//省份编码 + 市区编码
    //点击获取验证码
    $('#getCode').on('click', function (e) {
      e.preventDefault();//阻止浏览器默认行为
      var $name = $('#userName').val(),
        $phone = $('#userPhone').val();
      var phoneTrue = regPhone.test($phone);
      //判断输入数据是否为真；
      if ($name == '') {
        layer.open({
          content: '姓名不能为空'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userName').focus();
        return false;
      } else if ($('.choose_province').text() == '' || $('.choose_city').text() == '') {
        layer.open({
          content: '请选择地区'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userArea').focus();
        return false;
      } else if (!phoneTrue) {
        layer.open({
          content: '请输入正确手机号'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userPhone').focus();
        return false;
      } else {//发送验证码
        getCodeNum();
      }
    });
    //点击注册事件
    $('#loginBtn').on('click', function (e) {
      //判断用户是否同意协议
      var agreeTrue = $('#userAgree').prop('checked');
      console.log(agreeTrue);
      e.preventDefault();//阻止浏览器默认行为
      var $name = $('#userName').val(),
        $phone = $('#userPhone').val(),
        $code = $('#userCode').val();
      var phoneTrue = regPhone.test($phone),
        codeTrue = regCode.test($code);
      //判断输入数据是否为真；
      if ($name == '') {
        layer.open({
          content: '姓名不能为空'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userName').focus();
        return false;
      } else if ($('.choose_province').text() == '' || $('.choose_city').text() == '') {
        layer.open({
          content: '请选择地区'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userArea').focus();
        return false;
      } else if (!phoneTrue) {
        layer.open({
          content: '请输入正确手机号'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userPhone').focus();
        return false;
      } else if (!codeTrue) {
        layer.open({
          content: '验证码为4位数字'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        $('#userCode').focus();
        return false;
      } else if (!agreeTrue) {
        layer.open({
          content: '是否同意《涛部落协议》'
          , skin: 'msg'
          , time: 2 //2秒后自动关闭
        });
        return false;
      } else {
        //注册涛部落事件
        registerTao();
      }
    });
    //获取焦点得到省份，点击省份得到市
    $('#userArea').on('focus', function () {
      $('#userArea').attr({ 'placeholder': '' });
      $.ajax({
        url: getPort() + 'employee/getAllProvince',
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          console.log(data);
          if (data.statusCode == 1) {
            //获取数据成功；
            allProvinces = data;
            //渲染引擎模板
            var htmlProvince = template('provinceList', allProvinces);
            //弹出省份选择；
            layer.open({
              type: 1
              , title: [
                '选择地区',
                'background-color: #fff; color:#393939,font-size:.9rem,line-height:2.5rem;border-bottom:1px solid #ccc'
              ]
              , content: htmlProvince
            });
            //点击省份选择市
            $('.province_box>li').on('click', getAllCitys);
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
    //获取所有的市区
    function getAllCitys() {
      layer.closeAll();
      var pro1 = $(this).attr('procode');
      //显示省份
      $('.choose_province').text($(this).text());
      $.ajax({
        url: getPort() + 'employee/getCityByProvince',
        data: { 'provinceCode': pro1 },
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          console.log(data);
          if (data.statusCode == 1) {
            //获取数据成功；
            allCitys = data;
            var htmlCity = template('cityList', data);
            layer.open({
              type: 1
              , title: [
                '选择地区',
                'background-color: #fff; color:#393939,font-size:.9rem,line-height:2.5rem;border-bottom:1px solid #ccc'
              ]
              , content: htmlCity
            });
            $('.city_box>li').on('click', function () {
              layer.closeAll();
              //显示市
              var city1 = $(this).attr('citycode');
              allCode = pro1 + '' + city1;//得到区域编码
              $('.choose_city').text($(this).text());
            });
          } else if (data.statusCode == 0) {
            //获取数据失败,弹出提示消息
            layer.open({
              content: data.message
              , skin: 'msg'
              , time: 2 //2秒后自动关闭
            });
          }
        }
      });
    }
    //发送验证码
    function getCodeNum() {
      $('#getCode').attr('disabled', true);
      $.ajax({
        url: getPort() + 'sendmessage/messageCode',
        data: {
          mobilephone: $('#userPhone').val()
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
              $('#getCode').attr('disabled', true).text(num + 's');
            }, 1000);
            setTimeout(function () {
              clearInterval(timer);
              num = 60;
              $('#getCode').attr('disabled', false).text('重新发送');
            }, 60000);
          } else if (data.statusCode == 0) {
            //获取数据失败；
            $('#getCode').attr('disabled', false);
            layer.open({
              content: 'hello layer'
              , skin: 'msg'
              , time: 2 //2秒后自动关闭
            });
          }
        }
      });
    }
    //注册涛部落
    /**
     * 网络异常，看需要跳转哪一个网页
     * 
     */
    function registerTao() {
      var allData = {
        'openId': getCookie('openid'),
        'name': $('#userName').val(),
        'area': allCode,
        'mobilephone': $('#userPhone').val(),
        'messageCode': $('#userCode').val()
      };
      console.log($('#userCode').val());
      $.ajax({
        url: getPort() + 'employee/register',
        data: allData,
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          console.log(data);
          if (data.statusCode == 1) {
            //获取数据成功；跳转网页
            //获取数据成功，表示该用户已经存在；直接跳转到点击的对应页面
            if (paramTrue == 'addDoctor') {
              window.location.href = './addDocCode.html'//添加医生 
            } else if (paramTrue == 'doctorList') {
              window.location.href = './queryList.html'//医生列表
            } else if (paramTrue == 'resultStatistics') {
              window.location.href = './monCount.html'//积分统计
            } else if (paramTrue == 'cashRecord') {
              window.location.href = './monLog.html'//提现记录
            } else if (paramTrue == 'resultRule') {
              window.location.href = './taobiRules.html'//套币规则
            } else if (paramTrue == 'basicInfo') {
              window.location.href = './baseInfo.html'//基本信息
            } else if (paramTrue == 'inviteFriends') {
              window.location.href = './developFriend.html'//推荐好友
            }
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