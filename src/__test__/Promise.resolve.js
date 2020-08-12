/**
 * 有时需要将目标转为 状态为成功的Promise 对象，Promise.resolve()方法就起到这个作用。
 */
Promise.resolve('foo')

// 等价于
new Promise(resolve => resolve('foo'))


Promise.resolve(new Promise((resolve, reject) => {
    resolve('hello promise')
}))
