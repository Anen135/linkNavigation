let enabled = true;

chrome.storage.local.set({ enabled });

chrome.commands.onCommand.addListener((command) => {
  if (command === "toggle-extension") {
    enabled = !enabled;
    chrome.storage.local.set({ enabled });
    chrome.action.setBadgeText({ text: enabled ? "ON" : "OFF" });
  } else if (command === "toggle-hints") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { command: "toggle-hints" });
      }
    });
  }
});
