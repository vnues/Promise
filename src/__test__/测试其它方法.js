const Promise = require('./promise')


const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
    .then(result => result)
    .catch(e => e);

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve('hello1');
    }, 100)
})

const p3 = new Promise((resolve, reject) => {
    throw new Error('报错了');
}).then(result => result)
    .catch(e => e);


let p4 = Promise.all([p1, p2, p3])
    .then(result => console.log(result))
    .catch(e => console.log(e));


