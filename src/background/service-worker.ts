// 初始化侧边栏
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error('Failed to set panel behavior:', error));

// 处理扩展图标点击事件
chrome.action.onClicked.addListener(async (tab) => {
    try {
        // 打开侧边栏
        await chrome.sidePanel.open({ windowId: tab.windowId });
    } catch (error) {
        console.error('Failed to open side panel:', error);
    }
}); 