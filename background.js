// background.js
chrome.action.onClicked.addListener((tab) => {
    // 仅当标签页 URL 是 iconfont.cn 时才发送消息
    if (tab.url && tab.url.includes("iconfont.cn")) {
        chrome.tabs.sendMessage(tab.id, { action: "openSettings" }).catch(err => {
            // 忽略错误，可能 content script 尚未加载或页面正在跳转
            console.debug("发送消息失败，content script 可能未就绪", err);
        });
    } else {
        // 如果不是 iconfont 页面，可以打开一个新标签页或什么也不做
        console.debug("当前页面不是 iconfont.cn，不发送消息");
    }
});