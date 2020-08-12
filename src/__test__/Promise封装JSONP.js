/**
 * 字节面试题：
 * 用 JS 实现一个支持 Promise 的 jsonp 请求，2秒超时出 error
 *function request(options) {
 *  //todo
 *}
 *用法:
request({src: 'test.jsonp', timeout: 2000}).then(data => {}).catch(err => {})
 */



function request(options) {
    const { src, timeout } = options
    return new Promise((resolve, reject) => {
        // 注册回调函数 JSONP里没有执行函数反而是声明函数 给服务端调用 是这样的原理 最后把结果传递给Promise
        const callBackName = 'jsonp' + Math.ceil(Math.random() * 1000000)
        window[callBackName] = function (data) {
            head.removeChild(script)
            clearTimeout(script.timer)
            window[callBackName] = null
            resolve(data)
        }
        // 接下来就是JSONP原理
        const script = document.createElement('script')
        script.src = `${url}?callback=${callBackName}`
        const head = document.getElementsByTagName('head')[0]
        head.appendChild(script)
        script.onerror = function () {
            if (window[callBackName === null]) {
                reject('timeout')
            } else {
                window[callBackName] = null
                head.removeChild(script)
                reject('fail')
            }
        }
        script.timer = setTimeout(() => {
            window[callBackName] = null
            head.removeChild(script)
            /** 其实这里reject也行 */
        }, timeout)

    })
}