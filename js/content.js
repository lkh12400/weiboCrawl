/**
 * 接收小窗口事件请求后处理事件
 */
// 展开全文按钮事件
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.openContent) {
            openContent(sendResponse);
        }
    }
);
// 触发展开全文事件
function openContent(sendResponse) {
    // 点击展开全文的次数
    var clickCount = $(".WB_cardwrap.S_bg2.clearfix .comment_txt .WB_text_opt .W_ficon.ficon_arrow_down").length - 1;
    if (clickCount != -1) {
        $(".WB_cardwrap.S_bg2.clearfix .comment_txt .WB_text_opt .W_ficon.ficon_arrow_down").each(function (i, el) {
            setTimeout(function () {
                $(el).click();
                // console.log(clickCount+"--"+i);
                if (clickCount === i) {
                    sendResponse({"status":1, "message":"展开完毕"}); // 不知为嘛，定时里的方法不起作用，所以暂时随便点几次吧
                }
            }, i*300)
        })
    } else {
        sendResponse({"status":1, "message":"可以直接抓取"});
    }
}

// 保存列表数据 打开导入窗口页面
chrome.runtime.onMessage.addListener(
    function (request, sender, response) {
        if (request.start) {
            chrome.storage.local.set({"data":crawldata()}); // 保存数据到chrome.storage
            chrome.runtime.sendMessage(
                {
                    "action": "createWindow",
                    "datas":{
                        url: chrome.extension.getURL("crawl.html"),
                        type: 'popup',
                        focused: true,
                        width: 1000,
                        height: 600,
                        top: ((screen.availHeight-1000)/2),
                        left:((screen.availWidth-600)/2)
                    }
                }
            );
        }
    }
);

/**
 * 抓取页面数据并返回json字符串
 * mid 内容ID
 * face 头像
 * name 昵称
 * openContent 是否展开全文 true:是/false:否
 * content 内容
 * img 图片链接
 * vedio 视频链接
 * date 发表日期
 */
function crawldata() {
    var dataJson = [];
    $(".WB_cardwrap.S_bg2.clearfix").each(function () {
        var _this = $(this);
        if (_this.find(".face a").attr("title")) {// 过滤非用户数据
            var content = _this.find(".content .feed_content.wbcon .comment_txt:last");
            var img = [];
            _this.find(".content .WB_media_wrap .media_box ul li img[class!=loading_gif]").map(function () {img.push($(this).attr("src"));});
            var video = _this.find(".WB_media_wrap .media_box .WB_video");
            dataJson.push({
                "mid": _this.find("div[mid][tbinfo]").attr("mid"),
                "face": _this.find(".face a img").attr("src"),
                "name": _this.find(".face a").attr("title"),
                "openContent": content.find(".WB_text_opt").length > 0,
                "content": content.html(),
                "img": JSON.stringify(img),
                "video":video.length>0 ? {
                    src:decodeURIComponent(video.attr("action-data")).match(/video_src=(.*?)(?=&cover_img)/)[1], // 还有能一次匹配的写法么
                    img:decodeURIComponent(video.attr("action-data")).match(/cover_img=(.*?)(?=&card_height)/)[1]
                    }
                : "",
                "date": _this.find(".content .feed_from.W_textb a:first").attr("title")
            })
        }
    });
    var a = JSON.stringify(dataJson);
    // console.log("----"+a);
    return a;
}

