/**
 * author 甲日石
 * 手动实现多参数版 promise
 * 实现resolve, reject可以传多个参数 而在 async 函数中的 await 后只返回第一个参数
 * TODO 一个 then catch 执行链 执行完不会清除事件池，在 Promise 执行完，之后再注册的 then catch 不会执行
 **/
 export const $Promise = function $Promise (promise) {
	const self = this
	let count = 0
	self._events = []
	function add(call) {
		self._events.push(call)
		return self
	}
	// 所有的回调 按绑定顺序依次执行 传递的参数如果没有被接收使用 会一直传递 直到被接收或回调出错改为catch
	self.then = function (call) {
		call._flag = 1
		return add(call)
	}
	self.catch = function (call) {
		// catch的回调 在reject后执行一次 如果某个回调出错 再执行出错的回调之后的一个catch回调
		// catch的回调 不接受前回调的返回参数 其参数就是reject的参数或前回调的错误信息 但可以返回参数给下一个then
		call._flag = -1
		return add(call)
	}
	self.finally = function (call) {
		// finally的回调 不接受参数 不返回参数 把resolve,reject的参数或前一个回调返回的参数保留传给下一个非finally回调
		call._flag = 0
		return add(call)
	}
	function due(args, bool) { // bool 用来对应 evt (回调栈) 是 then 还是 catch 还是 finally
		delete self['<pending>']
		if (count < self._events.length) {
			const evt = self._events[count++]
			if (bool ? evt._flag >= 0 : evt._flag <= 0) {	// bool 对应上了 evt 
				// TODO catch回调中的错误还没做
				const value = evt(...(evt._flag == 0 ? [] : args))	// 执行 evt
				function next(args) {
					if (evt._flag == 0) {
						// finally的回调进来之后 要继续保持之前的bool
						due(args, bool)
					} else {
						// catch的回调进来之后 没有问题会调用接下来的then
						due([value], 1)
					}
				}
				if (value instanceof Promise || value instanceof $Promise) {
					value.then(function (...arg) {
						next(arg)
					})
				} else {
					next(args)
				}
			} else {	// 没对应上 evt 直接原封不动交给下一个 evt
				due(args, bool)
			}
		}
	}
	self['<pending>'] = undefined
	// promise 的函数参数 开始执行，加 setTimeout 防止 promise 的函数参数直接执行，后续的 then 等执行不到。
	setTimeout(function() {
		promise(function (...args) {
			self['<resolved>'] = undefined
			due(args, 1)
		}, function (...args) {
			self['<rejected>'] = undefined
			due(args, 0)
		})
	})
	return self
}
