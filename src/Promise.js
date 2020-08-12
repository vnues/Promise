/**
 * 1.同步操作✅
 * 2.异步操作✅ - 发布订阅模式（可以解决异步问题）
 * 3.链式调用✅
 * 4.实践中要确保 onFulfilled 和 onRejected 方法异步执行（模拟不了微任务所以用setTimout 0代替） ✅
 * 5.resolve具有拆箱功能✅
 * 清楚明白promise状态很重要
 * 想想then返回的promise 这个promise的值如何确定 状态如何确定的
 * reslove(x) 发布成功事件
 * 多个回调函数情况是这样的 p1.then p1.then 注意回调是注册到那个Promise对象上的
 * 什么时候需要trycatch,执行外部传入的回调函数的时候
 */

class Promise {
    constructor(executor) {
        /** pending、fulfilled、rejected */
        this.state = "pending";
        /** 成功的值 */
        this.value = void 0;
        /** 失败的原因 */
        this.reason = void 0;
        /** 成功存放的回调方法数组 */
        this.onResolvedCallbacks = [];
        /** 失败存放的回调方法数组 */
        this.onRejectedCallbacks = [];
        /** resolve方法将容器的状态更改为成功 */
        /**
         * resolve具有拆箱功能,reject不具有
         * 注意不止拆一层
         */
        let resolve = (value) => {
            if (value instanceof Promise) {
                value.then(resolve, reject)
                return
            }
            if (this.state === "pending") {
                this.state = "fulfilled";
                /** 参数resolve具有拆箱功能 */
                this.value = value
                this.onResolvedCallbacks.forEach((fn) => fn())
            }
        };
        /** reject方法将容器的状态更改为失败 */
        let reject = (reason) => {
            if (this.state === "pending") {
                this.state = "rejected";
                this.reason = reason;
                /** 一旦reject执行，调用回调失败数组的函数 */
                this.onRejectedCallbacks.forEach((fn) => fn());
            }
        };
        try {
            executor(resolve, reject);
        } catch (e) {
            reject(e);
        }
    }
    then(onFulfilled, onRejected) {
        /** 规范规定 如果 onFulfilled 不是函数且 promise1 成功执行， promise2 必须成功执行并返回相同的值 */
        onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (value) => value;
        /** 规范规定 如果 onRejected 不是函数且 promise1 拒绝执行， promise2 必须拒绝执行并返回相同的据因 */
        onRejected =
            typeof onRejected === "function"
                ? onRejected
                : (err) => {
                    throw err;
                };
        /** 链式调用 注意返回的promise2的状态 */
        const promise2 = new Promise((resolve, reject) => {
            if (this.state === "fulfilled") {
                setTimeout(() => {
                    try {
                        /** 规范规定 如果 onFulfilled 或者 onRejected 返回一个值 x ，则运行下面的 Promise 解决过程：[[Resolve]](promise2, x) */
                        let x = onFulfilled(this.value);
                        /** x为promise的话需要拆箱 x的值是promise2的value */
                        /**
                         * 规范指出 Promise 解决过程是一个抽象的操作，其需输入一个 promise 和一个值，我们表示为 [[Resolve]](promise, x)，
                         * 如果 x 有 then 方法且看上去像一个 Promise ，解决程序即尝试使 promise 接受 x 的状态；否则其用 x 的值来执行 promise 。
                         * 通过这句“使promise2接受x的状态”则推导出 resolvePromise(promise2, x, resolve, reject)
                         * 时刻记住then函数返回的是个Promsie对象
                         */
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else if (this.state === "rejected") {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                }, 0)
            } else {
                /** else:state是pending */
                /** 订阅resolve、reject事件 */
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            this.resolvePromise(promise2, x, resolve, reject);
                        } catch (e) {
                            reject(e);
                        }
                    }, 0)
                });
            }
        });
        /** promise2的状态如何决定 默认是resolve状态，当然还得由回调函数掘金 */
        return promise2;
    }
    /** 处理promise2与x的关系 并定义promise2的状态 */
    resolvePromise(promise2, x, resolve, reject) {
		/**
		 * 规范规定：
		 * 如果一个 promise 被一个循环的 thenable 链中的对象解决，
		 * 而 [[Resolve]](promise, thenable) 的递归性质又使得其被再次调用，
		 * 根据上述的算法将会陷入无限递归之中。算法虽不强制要求，但也鼓励施者检测这样的递归是否存在，
		 * 若检测到存在则以一个可识别的 TypeError 为据因来拒绝 promise
		 */
        /** 判断循环引用 */
        if (x === promise2) {
            // return的作用是不往下继续执行
            // console.log(new TypeError("Chaining cycle detected for promise"))
            return reject(new TypeError("Chaining cycle detected for promise"));
        }
		/**
		 * 规范规定： 针对于then来说的
		 * 如果 x 为对象或者函数：
		 * 把 x.then 赋值给 then
		 * 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
		 * 如果 then 是函数，将 x 作为函数的作用域 this 调用之。传递两个回调函数作为参数，第一个参数叫做
		 * 如果 then 不是函数，以 x 为参数执行 promise
		 * 如果 x 不为对象或者函数，以 x 为参数执行 promise
		 */
        if (x && (typeof x === "object" || typeof x === "function")) {
            let called = false
            try {
                let then = x.then;
                /**
                 * 规范
                 * 如果 resolvePromise 和 rejectPromise 均被调用，或者被同一参数调用了多次，则优先采用首次调用并忽略剩下的调用
                 * 存在这种情况 {then:(resolvePromise,rejectPromise)=>{resolvePromise();rejectPromise();throw Error()}}
                 * ✅不懂的场景翻翻测试用例
                 */
                if (typeof then === "function") {
                    /** 存在一个非promise对象拥有then方法 此时我们应该把其内部的this指向指向为x */
                    then.call(
                        x,
                        (y) => {
                            /**
                             * 规范：
                             * 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
                             * 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)
                             */
                            if (called) {
                                return
                            }
                            called = true
                            this.resolvePromise(promise2, y, resolve, reject);
                        },
                        (err) => {
                            /**
                             * 规范：
                             * 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                             */
                            if (called) {
                                return
                            }
                            called = true
                            reject(err);
                        }
                    );
                } else {
                    resolve(x);
                }
            } catch (e) {
                if (called) {
                    return
                }
                called = true
                reject(e);
            }
        } else {
            resolve(x);
        }
    }
    catch(fn) {
        return this.then(void 0, fn)
    }
    /** 将目标转为状态为成功的Promise 对象 */
    static resolve(value) {
        return value instanceof Promise ? value : new Promise((resolve) => {
            resolve(value)
        })
    }
    /** 将目标转为状态为失败的Promise 对象 */
    static reject(err) {
        return err instanceof Promise ? err : new Promise((resolve, reject) => {
            reject(value)
        })
    }
    /** race 的实现相比之下就简单一些，只要有一个 promise 执行完，直接 resolve 并停止执行 */
    static race(promises) {
        return new Promise((resolve, reject) => {
            if (!promises.length) {
                return
            } else {
                for (let i = 0; i < promises.length; i++) {
                    /** ®注册回调函数 异步执行回调函数 那个先执行了直接 resolve 并停止执行 */
                    Promise.resolve(promises[i]).then((data) => {
                        resolve(data)
                    })
                }
            }
        })
    }
    static all(promises) {
        const result = []
        return new Promise((resolve, reject) => {
            if (!promises.length) {
                resolve(result)
            } else {
                /**
                 * 注意不能用i===promises.length 注意这里是异步
                 */
                let index = 0
                for (let i = 0; i < promises.length; i++) {
                    Promise.resolve(promises[i]).then((data) => {
                        result.push(data)
                        index++
                        if (index === promises.length) {
                            resolve(result)
                        }
                    }, reject)
                }
            }
        })
    }
}


Promise.deferred = function () {
    var result = {};
    result.promise = new Promise(function (resolve, reject) {
        result.resolve = resolve;
        result.reject = reject;
    });

    return result;
}


module.exports = Promise