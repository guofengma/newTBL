(function () {
    $(function () {
        var theSelectDataStart = '';
        var theSelectDataEnd = '';
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
        //点击查询
        $('#queryBtn').on('click', function () {
            $('#listMon > ul').html('');
            $('.dropload-down').remove();
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
                getMonLog(theSelectDataStart,theSelectDataEnd);
            }
        });
        theSelectDataStart = formatDateDay(+getCookie('createTime'));
        theSelectDataEnd = formatDateDay(+new Date());
        getMonLog(theSelectDataStart,theSelectDataEnd);//默认打开页面请求
        $('.start_date_show').text(theSelectDataStart.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {return s1 + '年' + s2 + '月' + s3 + '日';}));
        $('.end_date_show').text(theSelectDataStart.replace(/(\d+)-(\d+)-(\d+)/g, function (s, s1, s2, s3) {return s1 + '年' + s2 + '月' + s3 + '日';}));
        //获取提现列表
        function getMonLog(startT,endT) {
            //下拉加载
            //页数
            var page = -1;
            //每页展示10个
            var size = 10;
            //dropload
            $('#listMon').dropload({
                scrollArea: window,
                loadDownFn: function (me) {
                    page++;
                    // 拼接HTML
                    var result = '';
                    $.ajax({
                        type: 'GET',
                        url: getPort() + 'scorecharge/searchScoreChargeHistory',
                        data: {
                            page: page,
                            pageSize: size,
                            employeeId: getCookie('id'),
                            startTime: startT,
                            endTime: endT
                        },
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.list) {
                                res.list.forEach(function (v, i) {
                                    result += '<li>'
                                        + '<p>' + formatDateDay(v.createTime) + '&nbsp;&nbsp; <span>' + formatDateSec(v.createTime) + '</span><i>' + v.chargeScore + '涛币</i></p>'
                                        + '</li>';
                                });
                                //如果没有数据
                            } else {
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            // 插入数据到页面，放到最后面
                            $('#listMon > ul').append(result);
                            // 每次数据插入，必须重置
                            me.resetload();
                        },
                        error: function (xhr, type) {
                            alert('请求失败，请稍后重试!');
                            // 即使加载出错，也得重置
                            me.resetload();
                        }
                    });
                }
            });
        }
        //时间戳格式化
        function formatDateDay(date) {
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
        //时间戳格式化
        function formatDateSec(date) {
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
                return [hour, minute, second].join(':');
            }
            else {
                return null;
            }
        }
    });
})();