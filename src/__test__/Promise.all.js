const p1 = new Promise((resolve, reject) => {
    resolve('hello');
})
    .then(result => result)
    .catch(e => e);

const p2 = new Promise((resolve, reject) => {
    throw new Error('报错了');
})
    .then(result => result)

Promise.all([p1, p2])
    .then(result => console.log(result))
    .catch(e => console.log(e));
// ["hello", Error: 报错了]



const p = new Promise((resolve, reject) => {
    // throw new Error('123')
}).catch((err) => { console.log(err) })