(function () {
    $(function () {

        //关键在于让下拉加载这个函数只执行一次；
        //设置页面高度
        $('body').height($('body')[0].clientHeight);
        var timeS = '';
        var timeE = formatDate(+new Date());
        var flag = true;
        //点击已入账和未入账按钮，显示相应信息
        $('.no_pass').hide();
        $('.passed').show();
        $('#hadMoney').on('click', function () {
            $(this).addClass('active');
            $('#noMoney').removeClass('active');
            $('.passed').show();
            $('.no_pass').hide();
        });
        $('#noMoney').on('click', function () {
            $(this).addClass('active');
            $('#hadMoney').removeClass('active');
            $('.no_pass').show();
            $('.passed').hide();
            if (flag) triggerRight(timeS, timeE);
            flag = false;
            return false;
        });
        //默认开始时间
        //点击已通过医生
        $('.passed_list_show').on('click', 'li', function () {
            console.log($(this).attr('docid'));
            setCookie('docid', $(this).attr('docid'));
            window.location.href = './docSelfInfo.html?id=' + getQueryString('id');
        });
        //时间戳格式化
        template.defaults.imports.dateFormat = function (date, format) {

            if (typeof date === "string") {
                var mts = date.match(/(\/Date\((\d+)\)\/)/);
                if (mts && mts.length >= 3) {
                    date = parseInt(mts[2]);
                }
            }
            date = new Date(date);
            if (!date || date.toUTCString() == "Invalid Date") {
                return "";
            }

            var map = {
                "M": date.getMonth() + 1, //月份
                "d": date.getDate(), //日
                "h": date.getHours(), //小时
                "m": date.getMinutes(), //分
                "s": date.getSeconds(), //秒
                "q": Math.floor((date.getMonth() + 3) / 3), //季度
                "S": date.getMilliseconds() //毫秒
            };


            format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
                var v = map[t];
                if (v !== undefined) {
                    if (all.length > 1) {
                        v = '0' + v;
                        v = v.substr(v.length - 2);
                    }
                    return v;
                } else if (t === 'y') {
                    return (date.getFullYear() + '').substr(4 - all.length);
                }
                return all;
            });
            return format;
        };

        function formatDate(date) {
            if (date != null && date != "") {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = '' + d.getFullYear(),
                    hour = '' + d.getHours(),
                    minute = '' + d.getMinutes(),
                    second = '' + d.getSeconds();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                if (hour.length < 2) hour = '0' + hour;
                if (minute.length < 2) minute = '0' + minute;
                if (second.length < 2) second = '0' + second;
                return [year, month, day].join('-');
            } else {
                return null;
            }
        }
        getStartTime();
        //取得合伙人的创建时间
        function getStartTime() {
            $.ajax({
                url: getPort() + 'doctor/getDefaultTime',
                data: {
                    'employeeId': getQueryString('id')
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        timeS = formatDate(+data.str);
                        triggerLeft(timeS, timeE);
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
        //触发事件
        function triggerLeft(timeS, timeE) {
            //下拉加载
            var pageNo = 0;
            //每页展示10个
            var sizeNo = 10;
            //dropload
            $('#hadListDoc').dropload({
                scrollArea: window,
                loadDownFn: function (me) {
                    pageNo++;
                    // 拼接HTML
                    var result = '';
                    $.ajax({
                        type: 'POST',
                        url: getPort() + 'doctor/getDoctorList',
                        data: {
                            currentPage: pageNo,
                            pageSize: sizeNo,
                            employeeId: getQueryString('id'),
                            startTime: timeS,
                            endTime: timeE
                        },
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.map.enableDoctor.length > 0) {
                                //用模板引擎
                                var passDochtml = template('passedDocList', res.map);
                                //如果没有数据
                            } else {
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //插入数据到页面，放到最后面
                            $('.passed_list_show').append(passDochtml);
                            //每次数据插入，必须重置
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

        function triggerRight(timeS, timeE) {
            // $('.list_show').empty();
            // $('.passed_list_show').empty();
            var pageHad = 0;
            //每页展示10个
            var sizeHad = 10;
            //dropload
            $('#noListDoc').dropload({
                scrollArea: window,
                loadDownFn: function (me) {
                    pageHad++;
                    // 拼接HTML
                    var result = '';
                    $.ajax({
                        type: 'POST',
                        url: getPort() + 'doctor/getDoctorNotList',
                        data: {
                            currentPage: pageHad,
                            pageSize: sizeHad,
                            employeeId: getQueryString('id'),
                            startTime: timeS,
                            endTime: timeE
                        },
                        dataType: 'json',
                        success: function (res) {
                            console.log(res);
                            if (res.map.notEnableDoctor.length > 0) {
                                var noPassHtml = template('noPassList', res.map);
                                //如果没有数据
                            } else {
                                // 锁定
                                me.lock();
                                // 无数据
                                me.noData();
                            }
                            //插入数据到页面，放到最后面
                            $('.list_show').append(noPassHtml);
                            //每次数据插入，必须重置
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
        //得到用户的所有医生数
        getAllDocNum();

        function getAllDocNum() {
            $.ajax({
                url: getPort() + 'doctor/getAllUserDoctor',
                data: {
                    employeeId: getQueryString('id')
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var res = {
                            list: [data.obj]
                        };
                        //添加医生按钮是否显示
                        if (data.obj.allDoctor == 0) {
                            $('#addDoc').css({
                                'opacity': 1,
                                'margin-top': '6rem',
                                'height': 'auto'
                            });
                        }
                        var docNumHtml = template('allData', res);
                        $('.doc_main').html(docNumHtml);
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
    //获取url？后面的参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
})();