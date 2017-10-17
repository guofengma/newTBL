(function () {
    $(function () {
        var todayTime = '';
        todayTime = formatDate(+new Date());
        var monthList = {};//取得当月的所有数据

        //加载当天数据
        getTodayData(todayTime);
        //点击每一天
        $("#calendarBox").ionCalendar({
            lang: 'zh-cn',
            format: 'YYYY-MM-DD',
            years: '2017-2020',
            onClick: function (date) {
                //点击发送请求；
                console.log(date);
                //点击加载获取当天数据
                getTodayData(date);
            },
            onReady: function (date) {
                //请求当月数据，并进行渲染
                $('.service_box').html('');
                $('.detail_box').html('');
                layer.open({
                    type: 2
                    ,content: '数据加载中'
                });
                console.log(date);
                getMonthData(date);
                $('.ic__day').on('click',function(){
                    $('.ic__day').removeClass('ic__day_state_selected');
                    $(this).addClass('ic__day_state_selected');
                });
                getTodayData(date);
                $('.ic__day').each(function(i,v){
                    if($(v).text() == getAllDate(date)) {
                        $(v).addClass('ic__day_state_selected');
                    }
                });
            }
        });
        //点击弹出时间段（事件委托）
        $('.service_box').on('click', '#queryTime', function () {
            $.ajax({
                url: getPort() + 'doctor/getOpenTimeOnDayByDoctorId',
                data: {
                    'YMD': $(this).attr('dateday'),
                    employeeId: getCookie('id'),
                    doctorId: getCookie('docid')
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var obj = data.obj;
                        var str1 = '';
                        var str2 = '';
                        var str3 = '';
                        $.each(obj, function (i, v) {
                            if (i == '09:00-12:00') {
                                obj[i].forEach(function (v, i) {
                                    str1 += '<li>' + v + '</li>';
                                });
                            } else if (i == '12:00-18:00') {
                                obj[i].forEach(function (v, i) {
                                    str2 += '<li>' + v + '</li>';
                                });
                            } else if (i == '18:00-20:00') {
                                obj[i].forEach(function (v, i) {
                                    str3 += '<li>' + v + '</li>';
                                });
                            }
                        });
                        var strTime = '<div class="time_box">'
                            + '<p>全天时间段</p>'
                            + '<ul class="box_head clearfix">'
                            + '<li class="active">09:00-12:00</li>'
                            + '<li>12:00-18:00</li>'
                            + '<li>18:00-20:00</li>'
                            + '</ul>'
                            + '<p>区间时间段</p>'
                            + '<ul class="box_main">'
                            + '<li>'
                            + '<ul class="click_show clearfix">'
                            + str1
                            + '</ul>'
                            + '</li>'
                            + '<li>'
                            + '<ul>'
                            + str2
                            + '</ul>'
                            + '</li>'
                            + '<li>'
                            + '<ul>'
                            + str3
                            + '</ul>'
                            + '</li>'
                            + '</ul>'
                            + '</div>';
                        layer.open({
                            type: 1
                            , content: strTime
                            , anim: 'up'
                            , style: 'position:fixed; bottom:0; left:0; width: 100%; padding: 0 .5rem; border:none;'
                        });
                        $('.box_main>li').hide().eq(0).show();
                        $('.box_head>li').on('click', function () {
                            $(this).addClass('active').siblings().removeClass('active');
                            $('.box_main>li').eq($(this).index()).show().siblings().hide();
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
        //请求当天数据
        function getTodayData(date) {
            $('.detail_box').html('');
            $('.service_box').html('');
            $.ajax({
                url: getPort() + 'doctor/getDoctorWorkScheduleByDay',
                data: {
                    employeeId: getCookie('id'),
                    doctorId: getCookie('docid'),
                    day: date
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var serviceInfo = data.obj;
                        var orderInfo = data.obj.order;
                        var oneStr = '', oneStrTime = '';
                        var twoStr = '', twoStrTime = '';
                        var threeStr = '';
                        if (serviceInfo.getvisopenphonetimeCount == 0) {
                            oneStr = '<span class="sure_open noOpen">未开启</span>';
                            oneStrTime = '该服务暂未开启';
                        } else {
                            oneStr = '<span class="sure_open">已开启</span>';
                            oneStrTime = '<p>' + serviceInfo.getvisopenphonetime + '个时段&nbsp;&nbsp;累计' + serviceInfo.getvisopenphonetimeCount + '小时</p>';
                        }
                        if (serviceInfo.getvisitmeCount == 0) {
                            twoStr = '<span class="sure_open noOpen">未开启</span>';
                            twoStrTime = '该服务暂未开启';
                        } else {
                            twoStr = '<span class="sure_open">已开启</span>';
                            twoStrTime = '<p>' + serviceInfo.getvisitmeCount + '个时段&nbsp;&nbsp;累计' + serviceInfo.getvisitmeDetailCount + '小时</p>';
                        }
                        if (serviceInfo.tzztransferstat == 0) {
                            threeStr = '<span class="sure_open noOpen">未开启</span>';
                        } else {
                            threeStr = '<span class="sure_open">已开启</span>';
                        }
                        var serviceStr = '<li class="clearfix time_area">'
                            + '<img src="./imgs/tbl_jkzx.png" alt="">'
                            + '<p>健康咨询-电话沟通服务' + oneStr + '</p>'
                            + oneStrTime
                            + '</li>'
                            + '<li class="clearfix" id="queryTime" dateday="' + date + '">'
                            + '<img src="./imgs/tbl_jzyy.png" alt="">'
                            + '<p>准时预约服务' + twoStr + '</p>'
                            + twoStrTime
                            + '</li>'
                            + '<li class="clearfix">'
                            + '<img src="./imgs/tbl_yyzl.png" alt="">'
                            + '<p>预约诊疗服务' + threeStr + '</p>'
                            + '<p>走基层和预约双向接受</p>'
                            + '</li>'
                        $('.service_box').html(serviceStr);
                        var orderStr = '';
                        if (orderInfo && orderInfo.length > 0) {
                            orderInfo.forEach(function (v, i) {
                                orderStr += '<li>'
                                    + '<p>' + v.serviceType + '<span>' + v.addTime.substr(v.addTime.indexOf(' ')) + '</span></p>'
                                    + '<p class="finish">' + v.ask_schedule + '</p>'
                                    + '</li>';
                            });
                            $('.detail_box').html(orderStr);
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
        //请求当月数据
        function getMonthData(date) {
            $.ajax({
                url: getPort() + 'doctor/getDoctorWorkScheduleByMonth',
                data: {
                    doctorId: getCookie('docid'),
                    employeeId: getCookie('id'),
                    month: date
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        monthList = data.obj;
                        getDataDay(monthList);
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
        //时间段格式化
        function formatDate(date) {
            if (date != null && date != "") {
                var d = new Date(date)
                    , month = '' + (d.getMonth() + 1)
                    , day = '' + d.getDate()
                    , year = '' + d.getFullYear()
                    , hour = '' + d.getHours()
                    , minute = '' + d.getMinutes()
                    , second = '' + d.getSeconds();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                if (hour.length < 2) hour = '0' + hour;
                if (minute.length < 2) minute = '0' + minute;
                if (second.length < 2) second = '0' + second;
                return [year, month, day].join('-');
            }
            else {
                return null;
            }
        }
        //得到有数据的天数
        function getDataDay(data) {
            $.each(data, function (i, v) {
                if (v == 1) {
                    $('.ic__day').eq(getAllDate(i) - 1).addClass('hadDate');//对有数据的天数进行赋值
                }
                layer.closeAll();
            });
        }
        //得到每一天的日历
        function getAllDate(date) {
            return date.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
                return s3;
            });
        }
    });
})();