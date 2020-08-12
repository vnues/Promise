const Promise = require('./promise')

const p1 = new Promise((resolve, reject) => {
    resolve(new Promise((resolve, reject) => {
        reject('hello resolve')
    }))
}).then((data) => { console.log('data', data) }).catch((err) => { console.log('err', err) })



const p1 = new Promise((resolve, reject) => {
    resolve(1)
})

const p2 = p1.then((value) => {
    console.log(value)
    return 2
})

const p3 = p2.then((value) => {
    console.log(value)
    return 3
})

const p4 = p3.then((value) => {
    console.log(value)
    throw Error(4)
})

p4.catch((err) => { console.log(err) })