module.exports = {
    retry: 2,
    baseUrl: "https://shri.yandex",
    gridUrl: "http://127.0.0.1:4444/wd/hub",
    browsers: {
        chrome: {
            desiredCapabilities: {
                browserName: 'chrome'
            }
        }
    }
};