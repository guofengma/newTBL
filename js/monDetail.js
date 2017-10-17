(function () {
    $(function () {
        //设置页面高度
        $('body').height($('body')[0].clientHeight);
        var theSelectDataStart = '';
        var theSelectDataEnd = '';
        //已入账和未入账的信息
        var hadPass = [];
        var noPass = [];
        //日期选择弹出框（开始）;
        var calendarStart = new datePicker();
        calendarStart.init({
            'trigger': '#dateStart', /*按钮选择器，用于触发弹出插件*/
            'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
            'minDate': '2000-1-1',/*最小日期*/
            'maxDate': '2030-12-31',/*最大日期*/
            'onSubmit': function () {/*确认时触发事件*/
                //得到选择的时间段，格式2017-09-10；
                theSelectDataStart = calendarStart.value;
                console.log(theSelectDataStart);
                var startTime = theSelectDataStart.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
                    return s1 + '年' + s2 + '月' + s3 + '日';
                });
                $('.start_date_show').text(startTime);
            }
        });
        //日期弹出框（结束）
        var calendarEnd = new datePicker();
        calendarEnd.init({
            'trigger': '#dateEnd', /*按钮选择器，用于触发弹出插件*/
            'type': 'date',/*模式：date日期；datetime日期时间；time时间；ym年月；*/
            'minDate': '2000-1-1',/*最小日期*/
            'maxDate': '2030-12-31',/*最大日期*/
            'onSubmit': function () {/*确认时触发事件*/
                //得到选择的时间段，格式2017-09-10；
                theSelectDataEnd = calendarEnd.value;
                console.log(theSelectDataEnd);
                var endTime = theSelectDataEnd.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {
                    return s1 + '年' + s2 + '月' + s3 + '日';
                });
                $('.end_date_show').text(endTime);
            }
        });
        //点击已入账和未入账按钮，显示相应信息
        $('.mon_had').show();
        $('.mon_no').hide();
        $('#hadMoney').on('click', function () {
            $(this).addClass('active');
            $('#noMoney').removeClass('active');
            $('.mon_had').show();
            $('.mon_no').hide();
        });
        $('#noMoney').on('click', function () {
            $(this).addClass('active');
            $('#hadMoney').removeClass('active');
            $('.mon_no').show();
            $('.mon_had').hide();
        });
        //点击查询按钮
        $('#queryBtn').on('click', function () {
            if ($('.start_date_show').text().trim() == '请选择开始时间') {
                layer.open({
                    content: '请选择开始时间'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if ($('.end_date_show').text().trim() == '请选择结束时间') {
                layer.open({
                    content: '请选择结束时间'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if (+new Date(theSelectDataStart) > +new Date(theSelectDataEnd)) {
                layer.open({
                    content: '开始时间不能大于结束时间'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else {
                findList(theSelectDataStart,theSelectDataEnd);
            }
        });

        theSelectDataStart = formatDate(+getCookie('createTime'));
        theSelectDataEnd = formatDate(+new Date());
        findList(theSelectDataStart,theSelectDataEnd);//默认打开页面请求
        $('.start_date_show').text(theSelectDataStart.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {return s1 + '年' + s2 + '月' + s3 + '日';}));
        $('.end_date_show').text(theSelectDataEnd.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {return s1 + '年' + s2 + '月' + s3 + '日';}));
        //查询方法
        function findList(startT,endT) {
            var dataList = {
                'employeeId': getCookie('id'),
                'startTime': startT,
                'endTime': endT,
                'page': 0,
                'pageSize': 10
            };
            $.ajax({
                url: getPort() + 'scorecharge/searchScoreHistory',
                data: dataList,
                dataType: 'json',
                type: 'POST',
                success: function (res) {
                    console.log(res);
                    if (res.statusCode == 1) {
                        //获取数据成功；
                        var data = res.list;
                        if (!data) {
                            layer.open({
                                content: '暂无数据'
                                , skin: 'msg'
                                , time: 2 //2秒后自动关闭
                            });
                            return false;
                        }
                        data.forEach(function (v, i) {
                            if (v.charge == 1) {
                                hadPass.push(v);//得到已入账信息
                            } else if (v.charge == 0) {
                                noPass.push(v);//得到未入账信息
                            }
                        });
                        var hadStr = '';
                        var hadStrImg = '';
                        var noStr = '';
                        var noStrImg = '';
                        //已入账信息
                        hadPass.forEach(function (v, i) {
                            if (v.header == '') {
                                hadStrImg = './imgs/icon.jpg';
                            } else {
                                hadStrImg = 'http://www.tdaifu.cn:8090/taodoctor' + v.header;
                            }
                            hadStr += '<li class="clearfix">'
                                + '<p class="timer_p">' + formatDateTime(v.createTime) + ' <span>准时预约服务</span></p>'
                                + '<div>'
                                + '<img src="' + hadStrImg + '" alt="">'
                                + '<p>' + v.doctorName + '<span><i>' + v.score + '</i>积分</span></p>'
                                + '<p>' + v.hospital + '</p>'
                                + '</div>'
                                + '</li>';
                        });
                        $('.mon_had > ul').html(hadStr);
                        //未入账信息
                        noPass.forEach(function (v, i) {
                            if (v.header == '') {
                                noStrImg = 'http://www.tdaifu.cn:8090/taodoctor' + './imgs/icon.jpg';
                            } else {
                                noStrImg = v.header;
                            }
                            hadStr += '<li class="clearfix">'
                                + '<p class="timer_p">' + formatDateTime(v.createTime) + ' <span>准时预约服务</span></p>'
                                + '<div>'
                                + '<img src="' + noStrImg + '" alt="">'
                                + '<p>' + v.doctorName + '<span><i>' + v.score + '</i>积分</span></p>'
                                + '<p>' + v.hospital + '</p>'
                                + '</div>'
                                + '</li>';
                        });
                        $('.mon_no').html(noStr);
                    } else if (res.statusCode == 0) {
                        //获取数据失败；
                        layer.open({
                            content: res.message
                            , skin: 'msg'
                            , time: 2 //2秒后自动关闭
                        });
                    }
                }
            });
        }
        //时间戳格式化日
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
        //时间戳格式化秒
        function formatDateTime(date) {
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
                return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
            }
            else {
                return null;
            }
        }
    });
})();