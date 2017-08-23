chrome.extension.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.action == "createWindow"){ // 打开导入窗口
		chrome.windows.create(message.datas, sendResponse);
	}
});



// chrome.webRequest.onBeforeRequest.addListener(
// 	function(details) {
// 		if (details.type == 'xmlhttprequest') {
// 			console.log("url---"+details.url);
// 		}
// 		if (details.type == 'media') {
// 			// alert(details.url);
// 			chrome.notifications.create(null, {
// 				type: 'basic',
// 				iconUrl: 'img/icon.png',
// 				title: '检测到音视频',
// 				message: '音视频地址：' + details.url,
// 			});
// 		}
// 	},
// 	{urls: ["<all_urls>"]},
// 	["blocking"]);