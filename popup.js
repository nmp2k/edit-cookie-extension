const cook = document.querySelector("#cook");
document.querySelector("#showCook").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let hostname = new URL(tabs[0].url);
    console.log(hostname);
    hostname = hostname.origin;
    console.log(hostname);

    chrome.cookies.getAll({ url: hostname }, (cookies) => {
      const res = cookies.map((cookie) => {
        delete cookie.hostOnly;
        delete cookie.storeId;
        delete cookie.session;
        cookie.url = hostname;
        return cookie;
      });
      cook.value = JSON.stringify(res);
    });
  });
});
document.querySelector("#clearcook").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let hostname = new URL(tabs[0].url);
    console.log(hostname);
    hostname = hostname.origin;
    chrome.browsingData.removeCookies({ origins: [hostname] }, function () {});
    chrome.tabs.reload(tabs[0].id);
  });
});
document.querySelector("#setcook").addEventListener("click", () => {
  const raw = JSON.parse(cook.value);
  raw.forEach((cookie) => {
    chrome.cookies.set(cookie, (result) => {});
  });
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.reload(tabs[0].id);
  });
});
