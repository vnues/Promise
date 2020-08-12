
const Promise = require("./promise")


let p1 = new Promise((resolve, reject) => {
    resolve("hello")
}).then((data) => {
    return new Promise((resolve, reject) => {
        resolve("hello reslovePromise")
    })
})

let p2 = p1.then((data) => {
    console.log(data)
})

let p3 = p1.then((data) => {
    console.log(data)
})


let p4 = p1.then((data) => {
    console.log(data)
})