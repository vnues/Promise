class Promise {
    constructor(executor) {
        /** pending、fulfilled、rejected */
        this.state = "pending";
        /** 成功的值 */
        this.value = void 0;
        /** 失败的原因 */
        this.reason = void 0;
        let resolve = (value) => {
            if (this.state === "pending") {
                this.state = "fulfilled";
                this.value = value
            }
        };
        let reject = (reason) => {
            if (this.state === "pending") {
                this.state = "rejected";
                this.reason = reason;
            }
        };
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        if (this.state === "fulfilled") {
            try {
                onFulfilled(this.value)
            } catch (e) {
                reject(e);
            }
        } else if (this.state === "rejected") {
            try {
                onRejected(this.reason);
            } catch (e) {
                reject(e);
            }
        }
    }
}

/** 测试同步 */
let p1 = new Promise((resolve, reject) => {
    resolve('hello Promise')
}).then((data) => {
    console.log(data)
})