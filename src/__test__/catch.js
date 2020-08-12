const p1 = new Promise((resolve, reject) => {
    throw new Error('err')
    resolve('success')
}).catch((err) => {
    console.log(err)
    return err
})

setTimeout(() => { console.log(p1) }, 0)



const p2 = new Promise((resolve, reject) => {
    throw new Error('err1')
    resolve('success')
}).catch((err) => {
    throw new Error('err2')
})


setTimeout(() => { console.log(p2) }, 0)
