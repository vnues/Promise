/**
 * 1.then返回的Promise对象是把状态已经reslove掉了❓- 你怎么知道 promise2 是 resolved？
 * 2.要看是哪个属性拿到result根据返回的promise状态就行  整个理解都围绕容器的状态
 */


const p1 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then(result => result)
    .catch(e => e);

// Promise {<rejected>: Error: 报错了

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then(result => result)

/** Promise这个容器我们最应该先关心它的状态 */

// Promise {<resolved>: Error: 报错了    
const p3 = p2.catch(e => e);



/** 没有自己的catch场景 */

const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
    .then(result => result);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then(result => result);

// Promise {<rejected>: Error: 报错了
const p3 = Promise.all([p1, p2])
    .then(result => console.log(result))
// Error: 报错了

// Promise {<resolved>: Error: 报错了    
const p3 = Promise.all([p1, p2])
    .then(result => console.log(result))
    // 没有啥问题默认就是reslove完它 代码好像是那样实现的
    .catch(e => console.log(e));