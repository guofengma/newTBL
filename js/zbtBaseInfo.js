(function () {
    $(function () {
        var busCode = '';//事业部门编码
        var areaCode = '';//大区编码
        var dibanCode = '';//地办编码
        //点击事业部
        $('#workPlace').on('click', function () {
            $.ajax({
                url: getPort() + 'employee/zbtDepartment',
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var busData = data;
                        var busHtml = template('bussizeList', busData);
                        //选择事业部门
                        layer.open({
                            type: 1
                            , title: [
                                '选择地区',
                                'background-color: #fff; color:#393939,font-size:.9rem,line-height:2.5rem;border-bottom:1px solid #ccc'
                            ]
                            , content: busHtml
                        });
                        $('.bussize_box > li').on('click', function () {
                            busCode = $(this).attr('buscode');
                            $('#workPlace').attr('value', $(this).text().trim());
                            layer.closeAll();
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
        //点击大区
        $('#bigArea').on('click', function () {

            if ($('#workPlace').val() == '事业部') {
                layer.open({
                    content: '请先选择事业部门'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else {
                getArea();
            }
        });
        //点击地办
        $('#placeHole').on('click', function () {
            if ($('#workPlace').val() == '事业部') {
                layer.open({
                    content: '请先选择事业部门'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if ($('#bigArea').val() == '大区') {
                layer.open({
                    content: '请先选择大区'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else {
                getDiban();
            }
        });
        //点击认证按钮
        $('#submitBtn').on('click', function () {
            if ($('#workPlace') == '事业部') {
                layer.open({
                    content: '请先选择事业部门'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if ($('#bigArea').val() == '大区') {
                layer.open({
                    content: '请先选择大区'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else if ($('#placeHole').val() == '地办') {
                layer.open({
                    content: '请先选择地办'
                    , skin: 'msg'
                    , time: 2 //2秒后自动关闭
                });
            } else {
                submitGo();
            }
        });
        //得到大区数据
        function getArea() {
            $.ajax({
                url: getPort() + 'employee/zbtDepartment',
                data: {
                    'departmentCode': busCode
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var areaData = data;
                        var areaHtml = template('bigAreaList', areaData);
                        //选择事业部门
                        layer.open({
                            type: 1
                            , title: [
                                '选择地区',
                                'background-color: #fff; color:#393939,font-size:.9rem,line-height:2.5rem;border-bottom:1px solid #ccc'
                            ]
                            , content: areaHtml
                        });
                        $('.bigArea_box > li').on('click', function () {
                            areaCode = $(this).attr('areacode');
                            $('#bigArea').attr('value', $(this).text().trim());
                            layer.closeAll();
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
        //得到地办数据
        function getDiban() {
            $.ajax({
                url: getPort() + 'employee/zbtDepartment',
                data: {
                    'departmentCode': areaCode
                },
                dataType: 'json',
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        var dibanData = data;
                        var dibanHtml = template('dibanList', dibanData);
                        //选择事业部门
                        layer.open({
                            type: 1
                            , title: [
                                '选择地区',
                                'background-color: #fff; color:#393939,font-size:.9rem,line-height:2.5rem;border-bottom:1px solid #ccc'
                            ]
                            , content: dibanHtml
                        });
                        $('.diban_box > li').on('click', function () {
                            dibanCode = $(this).attr('dicode');
                            $('#placeHole').attr('value', $(this).text().trim());
                            layer.closeAll();
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
        //提交认证
        function submitGo() {
            $.ajax({
                url: getPort() + 'employee/updateDepartment',
                dataType: 'json',
                data: {
                    'openId': getCookie('openid'),
                    'departmentCode': dibanCode
                },
                type: 'POST',
                success: function (data) {
                    console.log(data);
                    if (data.statusCode == 1) {
                        //获取数据成功；
                        layer.open({
                            content: data.message
                            , btn: '我知道了'
                            , yes: function () {
                                console.log(1);
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