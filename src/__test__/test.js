const Promise = require("./promise")


/** 测试同步 */
let p1 = new Promise((resolve, reject) => {
    resolve('hello Promise')
}).then((data) => {
    console.log(data)
})

/** 测试异步 */

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello Promise Async')
    }, 1000)
}).then((data) => {
    console.log(data)
})


/** 测试注册的回调函数返回Promise的场景 */

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello Promise Async')
    }, 1000)
}).then((data) => {
    return new Promise((resolve, reject) => {
        resolve('promise then')
    }).then((data) => {
        console.log(data)
    })
})


/** 测试resolvePromise函数 */

let p5 = new Promise((resolve, reject) => {
    resolve("hello resolvePromise")
}).then((data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        resolve("test resolvePromise")
    })
}).then((data) => {
    console.log(data)
})




/** 测试x与promise2循环引用 */

let p6 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello Promise Async')
    }, 1000)
})

let p7 = p6.then((data) => {
    return p7
})

p7.catch((err) => {
    console.log(err)
})



/** 测试同时调用resolvePromise、rejectPromise */


let p8 = new Promise((resolve, reject) => {
    resolve('hello Promise')
}).then((data) => {
    console.log(data)
    return {
        then: function (resolvePromise, rejectPromise) {
            resolvePromise('resolvePromise');
            rejectPromise('rejectPromise');
        }
    }
})

p8.then((data) => { console.log('data', data) }, (err) => { console.log(err) })
