/**
 * 头条面试题：
 * Promise封装ajax请求
 */

function ajaxRequest(options) {
    const { url, method, dataType } = options
    return new Promsie((resolve, rejet) => {
        const xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        xhr.onreadystatechange = function () {
            /**
             * xhr.status 状态码
             */
            if (xhr.readyState === 4 && (xhr.status >= 200 &&
                xhr.status < 300 ||
                xhr.status == 304)) {
                const result = xhr.responseText
                resolve(result)
            } else {
                reject(xht.status)
            }
        }
        xhr.onerror = (err) => {
            reject(err)
        }
        xhr.ontimeout = function () {
            reject('请求超时')
        }
        xhr.send()
    })
}

/** 注意还要send data */
/**
 * 
 * 写个koa跑跑
 */
function ajax(options) {
    let url = options.url
    const method = options.method.toLocaleLowerCase() || 'get'
    const async = options.async != false // default is true
    const data = options.data
    const xhr = new XMLHttpRequest()

    if (options.timeout && options.timeout > 0) {
        xhr.timeout = options.timeout
    }

    return new Promise((resolve, reject) => {
        xhr.ontimeout = () => reject('请求超时')
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                    resolve(JSON.parse(xhr.responseText))
                } else {
                    reject()
                }
            }
        }
        xhr.onerror = err => reject(err)

        let paramArr = []
        let encodeData
        if (data instanceof Object) {
            for (let key in data) {
                // 参数拼接需要通过 encodeURIComponent 进行编码
                paramArr.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
            }
            encodeData = paramArr.join('&')
        }

        if (method === 'get') {
            // 检测 url 中是否已存在 ? 及其位置
            const index = url.indexOf('?')
            if (index === -1) url += '?'
            else if (index !== url.length - 1) url += '&'
            // 拼接 url
            url += encodeData
        }

        xhr.open(method, url, async)
        if (method === 'get') xhr.send(null)
        else {
            // post 方式需要设置请求头
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8')
            xhr.send(encodeData)
        }
    })
}


ajax({
    url: 'your request url',
    method: 'get',
    async: true,
    timeout: 1000,
    data: {
        test: 1,
        aaa: 2
    }
}).then(
    res => console.log('请求成功: ' + res),
    err => console.log('请求失败: ' + err)
)``


const axios = function (options) {
    let promise = new promise((resolve, reject) => {
        var xhr = null;
        if (window.XMLHttpRequest) {//兼容处理
            xhr = new XMLHttpRequest();
        } else {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        var data = "";
        for (var key in options.data) {//数据处理
            data += "&" + key + "=" + options.data[key]
        }
        if (options.method == "get") {

            let url = options.url + "?" + data.slice(1);
            xhr.open(options.method, url);
            xhr.send();
        } else if (options.method == "post") {

            xhr.open(options.method, options.url);
            xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhr.send(data);
        }


        xhr.onreadystatechange = function () {
            let timer = null;
            let timeout = options.timeout ? options.timeout : 5000  //等待响应的时间 
            if (xhr.readyState == 4 && xhr.status == 200) {
                let res = JSON.parse(xhr.responseText);
                clearTimeout(timer);
                resolve(res);
            }


            timer = setTimeout(() => {
                clearTimeout(timer);
                reject(xhr.status);
            }, timeout)

        }
    })
    return promise;
}