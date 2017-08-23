/**
 * 小窗口页面事件
 */
// 点击抓取按钮便发送请求，并关闭小窗口
$(function(){
	//展开全文
	$("#open_btn").click(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {openContent:true},function(response){
				if (response.status == 1) {
					$("#open_btn").text(response.message).attr("disabled", true);
				}
			});
		});
	});
	// 抓取
	$("#crawl_btn").click(function(){
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {start:true},function(response){
				window.close();
			});
		});
	});
});
