/** 如果返回值Promise */


let p1 = new Promise((resolve, reject) => {
    /** resolve有拆箱功能吗还是交由then来拆 */
    resolve(new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello promise')
        }, 1000)
    }))
}).then((value) => {
    console.log(value)
    return new Promise((resolve, reject) => {
        resolve(value + 'then')
    })
}).then((value) => { console.log(value) })

// then方法return出的x为promise


/**
 * 不可能存在这种循环引用
 * 场景是promise2与x
 */
let p = new Promise(resolve => {
    resolve(p); // 未声明就使用了
});