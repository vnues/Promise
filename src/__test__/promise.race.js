const Promise = require('./promise')


/** 测试Promise.race */
const p1 = Promise.resolve(1),
    p2 = Promise.resolve(2),
    p3 = new Promise((resolve, reject) => {
        throw new Error(3)
    })
Promise.race([p1, p2, p3]).then(function (value) {
    console.log(value);  // 1
})