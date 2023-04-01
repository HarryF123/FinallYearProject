
// if (!chrome.contextMenus.onClicked.hasListener(onClickHandler)) {
//   chrome.contextMenus.create({
//     id: "mysql-highlight",
//     title: "Add Term to Database",
//     contexts: ["selection"]
//   });
//   chrome.contextMenus.create({
//     id: "create",
//     parentId: "mysql-highlight",
//     title: "Create Subject",
//     contexts: ["all"]
//   });
//   chrome.contextMenus.create({
//     id: "save",
//     parentId: "mysql-highlight",
//     title: "Save to Subject",
//     contexts: ["all"]
//   });
// }

// // Add a listener to handle clicks on the dropdown items
// chrome.contextMenus.onClicked.addListener(function (info, tab) {
//   if (info.menuItemId == "create") {
//     console.log('Create');
//     chrome.windows.create({
//       url: "/popups/createSubject.html",
//       type: "popup",
//       width: 200,
//       height: 200
//     });
//   } else if (info.menuItemId == "save") {
//     console.log('Save');
//     chrome.browserAction.setPopup({ popup: "popup.html#special-content" });

//   }
// });

// chrome.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     if (details.method === 'GET') {
//       const url = new URL(details.url);
//       if (url.pathname === '/search' && url.searchParams.has('q')) {
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//           const searchQuery = url.searchParams.get('q');
//           chrome.tabs.sendMessage(tabs[0].id, { searchQuery: searchQuery });
//         });
//       }
//     }
//   },
//   { urls: ['<all_urls>'] }, ['blocking']
// );

// chrome.webNavigation.onCompleted.addListener((details) => {
//   if (details.frameId === 0 && details.url.startsWith('https://www.google.com/search')) {
//     chrome.tabs.executeScript(details.tabId, { file: 'content.js' });
//   }
// }, { url: [{ hostEquals: 'www.google.com' }] });

