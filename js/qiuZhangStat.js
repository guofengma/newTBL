$(function(){
    layer.open({
        type: 2
        ,content: '数据加载中，请稍后…'
    });
    $.ajax({
        url: getPort() + 'partner/getChiefListInfo',
        data:{
            employeeId:getCookie('id')
        },
        dataType: 'json',
        type: 'POST',
        success: function (data) {
          console.log(data);
          if (data.statusCode == 1) {
            //获取数据成功；
            var topHtml = template('headTop',data.obj);
            $('.top').html(topHtml);
            $('#numPeople').text('酋长：总共'+data.obj.allCheifCount+'人');
            data.obj.employeeListInfo.forEach(function(v,i){
                if(v.headerImage) {
                    v.headerImage = getImagePort() + v.headerImage;
                }
            });
            var mainHtml = template('mainBox',data.obj);
            layer.closeAll();
            $('.con>ul').html(mainHtml);
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
    $('.con>ul').on('click','li',function(){
        window.location.href = './queryList.html?id='+$(this).data('id');
    });
});