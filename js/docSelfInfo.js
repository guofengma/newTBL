(function () {
    $(function () {
        $.ajax({
            url: getPort() + 'doctor/getDoctorDetailById',
            dataType: 'json',
            data: {
                doctorId: getCookie('docid'),
                employeeId: getQueryString('id')
            },
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；
                    var obj = {
                        list:[data.obj]
                    };
                    var docStatusHtml = template('docStatus',obj);
                    $('.doc_two').html(docStatusHtml);
                    var docServiceHtml = template('docService',obj);
                    $('.doc_open_three').html(docServiceHtml);
                    if(data.obj.fourCard == 0) {
                        getFiveZ();
                    }
                    var docInfo = data.obj.doctorDetail;
                    var headImg = '';
                    if(docInfo.header == '') {
                        headImg = './imgs/information_logo.png';
                    }else {
                        headImg = docInfo.header;
                    }
                    var creatStr = '<p>邀请时间：'+formatDate(data.obj.createTime)+'</p>'
                        + '<div class="doc_logo clearfix">'
                        + '<img src="'+headImg+'" alt="">'
                        + '<span>'+docInfo.name+' &nbsp '+docInfo.department+'</span>'
                        + '<span>'+docInfo.hospitalName+'</span>'
                        + '<a href="./docSelfInfoDetail.html" id="selfMore">'
                        + '<i class="iconfont icon-right"></i>'
                        + '</a>'
                        + '</div>'
                    $('.doc_one').html(creatStr);
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
        function getFiveZ() {
            $.ajax({
                url: getPort() + 'doctor/getfourCardByDoctorId',
                data:{
                    doctorId:getCookie('docid'),
                    employeeId:getQueryString('id')
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var obj = {
                            list:[data.obj]
                        };
                        var fiveZHtml = template('becaFor',obj);
                        $('.register_doc').append(fiveZHtml);
                        if(data.obj) {
                            $('#noNum').text('缺少'+data.obj.number+'证');//显示缺少几证信息，后台返回为null，则显示未上传
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
        }
        //格式时间戳
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
                return [year, month, day].join('-') + '&nbsp;' + [hour, minute, second].join(':');
            }
            else {
                return null;
            }
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