(function () {
    $(function () {
        $.ajax({
            url: getPort() + 'doctor/getDoctorSimpleDateById',
            data:{
                employeeId:getCookie('id'),
                doctorId:getCookie('docid')
            },
            dataType: 'json',
            type: 'POST',
            success: function (data) {
                console.log(data);
                if (data.statusCode == 1) {
                    //获取数据成功；
                    var res = data.obj;
                    var headImg = '';
                    if(res.heard == '') {
                        headImg = './imgs/information_logo.png';
                    }else {
                        headImg = res.heard;
                    }
                    var headStr = '<img src="'+ headImg +'" alt="">'
                                +'<span>'+res.name+'医生 &nbsp '+res.department+'</span>'
                                +'<span>'+res.hospital_name+'</span>';
                    $('.doc_logo').html(headStr);
                    var bodyStr = '<li class="clearfix">'
                                +'<p>执业点</p>'
                                +'<p>'+res.hospital_name2+'&nbsp;&nbsp;'+res.department2+'</p>'
                                +'</li>'
                                +'<li class="clearfix">'
                                +'<p>简介</p>'
                                +'<p>'+res.remark+'</p>'
                                +'</li>'
                                +'<li class="clearfix">'
                                +'<p>擅长</p>'
                                +'<p>'+res.disease_name+'</p>'
                                +'</li>';
                    $('.doc_detail > ul').html(bodyStr);
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