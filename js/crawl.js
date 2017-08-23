$(function(){
    var dataJson = ""; // 需保存的数据
    // 解析chrome.storage的数据，并把需展开全文的内容补充完整
    chrome.storage.local.get('data', function(result){
        var html = "";　// 页面数据展示
        dataJson = JSON.parse(eval(result).data);
        $.each(dataJson,function (i, value) {
            if (value.openContent) { // 如果需展开全文，则要根据mid发送请求获取完整的内容
                // console.log(value.name+"--"+value.openContent);
                $.ajax({
                    url:"http://s.weibo.com/ajax/direct/morethan140?mid="+value.mid,
                    type:"GET",
                    async:false,
                    success: function(data){
                        /** 重置content和openContent */
                        value.content = decodeURIComponent(data.data.html);
                        value.openContent = false;
                    },
                    error: function(){
                        console.log(data.code+"--"+data.msg)
                    }
                })
            }
            var mediaHtml = "";
            if (JSON.parse(value.img).length > 0) {
                $.each(JSON.parse(value.img), function (j, imgurl) {
                    mediaHtml += "<img src='"+imgurl+"'>";
                });
            } else if (value.video) {
                mediaHtml += "视频封面：<img src='"+value.video.img+"'><br>视频链接："+value.video.src+"";
            } else {
                mediaHtml += "无图片/视频";
            }
            html += "<tr>";
            html += "<td><img src='"+value.face+"'></td>";
            html += "<td>"+value.name+"</td>";
            html += "<td>"+value.content+"</td>";
            html += "<td>" + mediaHtml +"</td>";
            html += "<td>"+value.date+"</td>";
            // html += "<td>不导入</td>";
            html += "</tr>";
        })
        $("#list tr:gt(0)").remove();
        $("#list").append(html);
        chrome.storage.local.set({"data":JSON.stringify(dataJson)}); // 更新datajson，在不刷新标签页的情况下，再次抓取时便不会再发送请求
    });

    // 向服务器接口发送请求
    $(".import").click(function () {
        // console.log(22+"---"+JSON.stringify(dataJson))
        $.ajax({
            url:"请求url，可把数据保存到其他地方",
            data: {"json":JSON.stringify(dataJson)},
            type:"POST",
            success: function(data){
                var data = JSON.parse(data);
                alert(data.data)
            },
            error: function(){
                var data = JSON.parse(data);
                alert(data.data);
            }
        })
    })
})
