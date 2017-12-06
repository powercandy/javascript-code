import userAgent from 'useragent.js'
import md5 from 'md5'
import {
	_URL_,
	_CZBURL_,
	_KEY_,
	_CV_,
	_V_,
	APPSECRET,
	APPKEY
} from '__lib__/env'
import cleave from 'cleave.js'
import 'cleave.js/dist/addons/cleave-phone.cn'

import axios from 'axios'
// import {_CZBURI_} from './env'

/**
 * @desc UA 获取浏览器以及操作系统详细信息
 * @desc MD5 MD5加密
 *
 * @desc _setItem 存储 sessionStorage
 * @desc _getItem 获取 sessionStorage
 * @desc _removeItem 删除 sessionStorage
 *
 * @desc _dataEncode 数据拼接器
 * @desc _UUID 随机数生成器
 */

/**
 * userAgent
 * @desc 获取浏览器以及操作系统详细信息
 * [github](https://github.com/zsxsoft/useragent.js)
 * [demo](http://project.zsxsoft.com/useragent.js/)
 *
 * 浏览器
 * ua.browser.ua
 * ua.browser.name
 * ua.browser.version
 * ua.browser.full
 * ua.browser.dir
 * ua.browser.image
 *
 * 设备
 * ua.device.ua
 * ua.device.name
 * ua.device.brand
 * ua.device.full
 * ua.device.model
 * ua.device.dir
 * ua.device.image
 *
 * 系统
 * ua.os.ua
 * ua.os.name
 * ua.os.version
 * ua.os.full
 * ua.os.windows
 * ua.os.linux
 * ua.os.x64
 * ua.os.dir
 * ua.os.image
 *
 * 平台
 * ua.platform.ua
 * ua.platform.name
 * ua.platform.brand
 * ua.platform.model
 * ua.platform.full
 * ua.platform.dir
 * ua.platform.image
 *
 * uaerAgent
 * ua.ua
 */
export const UA = userAgent.analyze(navigator.userAgent)

export const __hasClass = (ele, cls) => {
	return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

export const __addClass = (ele, cls) => {
	if (!__hasClass(ele, cls)) ele.className += '' + cls
}

export const __removeClass = (ele, cls) => {
	if (__hasClass(ele, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
		ele.className = ele.className.replace(reg, '')
	}
}

export const __toggleClass = (ele, cls) => {
	if (__hasClass(ele, cls)) {
		__removeClass(ele, cls)
	} else {
		__addClass(ele, cls)
	}
}
/**
 * 时间戳格式化
 * @param {number} date 需要格式化的时间戳
 * @return {String} 返回格式化后的日期
 */
export const __formatTime = date => {
	var time = date
	var t,
		y,
		m,
		d
	t = time ? new Date(time) : new Date()
	y = t.getFullYear()
	m = t.getMonth()
	d = t.getDate()

	return [y, m, d].map(__dateFill).join('-')
}

/**
 * 获取指定天数后的新日期
 * @param {Number} Num 需要获取指定的天数 (10 获取十天后的日期)
 * @return {String} 返回指定天数后的日期
 */
export const __getDate = Num => {
	var t = new Date()
	var time = t.getTime() + Num * 24 * 60 * 60 * 1000
	t.setTime(time)
	var y = t.getFullYear()
	var m = t.getMonth() + 1
	var d = t.getDate()
	return ([y, m, d].map(__dateFill).join('.'))
}

/**
 * 日期补位 (月/日前面补0)
 * @param {number} n 需要补位的数字
 * @return {string} 返回补位后的字符串
 */
export const __dateFill = n => {
	n = n.toString()
	return n[1] ? n : '0' + n
}

/**
 * 千分位格式化(金额)
 * @param {number} number 需要格式化的数字
 * @param {number} decimals 显示小数位数 (默认 2 位)
 * @param {} decimalPoint 小数点符号 (默认 .)
 * @param {} thousandsSep 千分位符号 (默认 ,)
 */
export const __formatNumber = (number, decimals, decimalPoint, thousandsSep) => {
	number = parseFloat(number)
	if (isNaN(number)) return false

	// 显示小数点位数 (默认 2 位)
	decimals = decimals || 2

	// 小数点符号 (默认 .)
	decimalPoint = decimalPoint || '.'

	// 千分位符号 (默认 ,)
	thousandsSep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep

	number = parseFloat(number).toFixed(decimals)
	number = number.replace(/\.|,/g, decimalPoint)

	var x = number.split(decimalPoint)
	var x1 = x[0]
	var x2 = x[1]
	var rgx = /(\d+)(\d{3})/

	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2')
	}

	var output = x1.replace(/,/g, thousandsSep)

	return (output + decimalPoint + x2)
}
/**
 * 格式化数字
 * @param number
 * @param pattern
 * @return
 */
export const formatNumber = (number, pattern) => {
	var str = number.toString()
	var strInt
	var strFloat
	var formatInt
	var formatFloat
	if (/\./g.test(pattern)) {
		formatInt = pattern.split('.')[0]
		formatFloat = pattern.split('.')[1]
	} else {
		formatInt = pattern
		formatFloat = null
	}
	if (/\./g.test(str)) {
		if (formatFloat != null) {
			var tempFloat = Math.round(parseFloat('0.' + str.split('.')[1]) * Math.pow(10, formatFloat.length)) / Math.pow(10, formatFloat.length)
			strInt = (Math.floor(number) + Math.floor(tempFloat)).toString()
			strFloat = /\./g.test(tempFloat.toString()) ? tempFloat.toString().split('.')[1] : '0'
		} else {
			strInt = Math.round(number).toString()
			strFloat = '0'
		}
	} else {
		strInt = str
		strFloat = ''
	}
	if (formatInt != null) {
		var outputInt = ''
		var zero = formatInt.match(/0*$/)[0].length
		var comma = null
		if (/,/g.test(formatInt)) {
			comma = formatInt.match(/,[^,]*/)[0].length - 1
		}
		var newReg = new RegExp('(\\d{' + comma + '})', 'g')
		if (strInt.length < zero) {
			outputInt = new Array(zero + 1).join('0') + strInt
			outputInt = outputInt.substr(outputInt.length - zero, zero)
		} else {
			outputInt = strInt
		}
		outputInt = outputInt.substr(0, outputInt.length % comma) + outputInt.substring(outputInt.length % comma).replace(newReg, (comma != null ? ',' : '') + '$1')
		outputInt = outputInt.replace(/^,/, '')
		strInt = outputInt
	}
	if (formatFloat != null) {
		var outputFloat = ''
		zero = formatFloat.match(/^0*/)[0].length
		if (strFloat.length < zero) {
			outputFloat = strFloat + new Array(zero + 1).join('0')
			// outputFloa = outputFloat.substring(0,formatFloat.length)
			var outputFloat1 = outputFloat.substring(0, zero)
			var outputFloat2 = outputFloat.substring(zero, formatFloat.length)
			outputFloat = outputFloat1 + outputFloat2.replace(/0*$/, '')
		} else {
			outputFloat = strFloat.substring(0, formatFloat.length)
		}
		strFloat = outputFloat
	} else {
		if (pattern !== '' || (pattern === '' && strFloat === '0')) {
			strFloat = ''
		}
	}
	return strInt + (strFloat === '' ? '' : '.' + strFloat)
}
/**
 * 千分位格式化(数字)
 * @param {number} num 需要格式化的数字
 */
export const __numberFormat = num => {
	// 判断是否是数字
	if (typeof num !== 'number') return false
	// 字符化
	num = num.toString()
	var s = num.match(/e\+(\d+)$/)
	var ext = 0
	num = num.replace(/e.+$/, '')
	if (s) ext = Number(s[1])

	// 分割小数点两边
	var tA = num.split('.')
	// 有小数点则分割开来处理(小数点后面可能还跟有科学记数法表示)
	if (tA.length >= 2 && ext) {
		if (tA.length > ext) {
			tA[0] += tA[1].slice(0, ext - 1)
			tA[1] = tA[1].slice(ext - 1, tA[1].length - 1)
		} else {
			tA[0] += (tA[1] + '0'.repeat(ext - tA.length))
			tA[1] = ''
		}
	}
	// 拆字符
	tA[0] = tA[0].split('')
	// 插逗号
	for (var i = tA[0].length; (i -= 3) > 0;) {
		tA[0].splice(i, 0, ',')
	}
	// 连起来
	return tA[0].join('') + (tA[1] ? '.' + tA[1] : '')
}
/**
 * 跳转页面不记录URL
 */
export const __urlReplace = uri => {
	// if (!ele) {
	// 	return
	// }
	// var href = ele.href
	var href = uri
	if (href && /^#|javasc/.test(href) === false) {
		if (history.replaceState) {
			history.replaceState(null, document.title, href.split('#')[0] + '#')
			location.replace('')
		} else {
			location.replace(href)
		}
	}
}
/**
 * MD5加密
 */
export const MD5 = md5

/**
 * 字符串分割
 */
export const Cleave = cleave

/**
 * 存储localStorage
 */
export const _setItem = (name, content) => {
	if (!name) return
	if (typeof content !== 'string') {
		content = JSON.stringify(content)
	}
	window.sessionStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const _getItem = name => {
	if (!name) return
	return window.sessionStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const _removeItem = name => {
	if (!name) return
	window.sessionStorage.removeItem(name)
}

/**
 * 检测是否是微信浏览器
 */
export const __isWeChat = () => {
	var ua = window.navigator.userAgent.toLowerCase()
	var REG = /MicroMessenger/i
	if (REG.test(ua)) return true
	else return false
}

export const __isApp = () => {
	if (window.yfqInfo) return true
	else return false
}
// 车主邦一键加油功能 md5加密

/**
 * 数据拼接器
 * @param obj 将要转为URL参数字符串的对象
 * @param encode true/false 是否进行 URL 编码, 默认为 false
 *
 * @return URL参数字符串
 */
export const _dataEncode = (obj, encode = false) => {
	/**
	 * Default 默认参数
	 * @param t [是] 时间戳
	 * @param id [否] 设备标识(openid / 15位随机数)
	 * @param os [是] 操作系统，0：IOS，1：Android，2：微信，3：WAP，4：PC
	 * @param osv [是] 操作系统版本号
	 * @param token [否] 用户身份识别凭证
	 * @param sign [是] 签名 MD5(t + id + os + v + token + data + key)
	 * @param v [是] 接口版本号
	 * @param cv [否] 客户端版本号
	 * @param data [否] 业务参数 {"a":"av","b":"bv","c":["cv1","cv2"],"d":{"dk1":"dv1","dk2":"dv2"}}
	 */
	let Default
	if (!window.yfqInfo) {
		Default = {
			t: new Date().getTime(),
			id: _getItem('id') || _UUID(15),
			os: (__isWeChat()) ? 2 : 3,
			osv: UA.browser.full,
			token: _getItem('token') || '',
			// token: '0733aedc186642658dbee363c65a695e',
			sign: null,
			v: _V_,
			cv: _CV_,
			data: null
		}
	} else {
		let appInfo = JSON.parse(window.yfqInfo.getAppInfo())
		Default = {
			t: new Date().getTime(),
			id: appInfo.id,
			os: appInfo.os,
			osv: appInfo.osv,
			token: appInfo.token,
			// token: '0733aedc186642658dbee363c65a695e',
			sign: null,
			v: appInfo.v,
			cv: appInfo.cv,
			data: null
		}
	}

	var objPar = Object.assign(Default, obj)

	if (!_getItem('id')) {
		_setItem('id', objPar.id)
	}
	// 签名加密 MD5(t+id+os+v+token+data+key)
	objPar.sign = MD5(objPar.t + objPar.id + objPar.os + objPar.v + objPar.token + (objPar.data !== null ? objPar.data : '') + _KEY_)

	var objStr = ''
	for (let i in objPar) {
		if (objPar[i] !== null) {
			// 拼接参数
			objStr += '&' + i + '=' + ((encode === null || encode) ? encodeURIComponent(objPar[i]) : objPar[i])
		}
	}
	objStr = objStr.substr(1)
	return objStr
}

export const _httpEncode = (obj, encode = false) => {
	let Default = {
		app_key: APPKEY,
		timestamp: new Date().getTime(),
		token: window.sessionStorage.getItem('token')
	}
	var sign = ''
	var objPar = Object.assign(Default, obj)
	var objs = __objSort(objPar)
	for (let i = 0; i < objs.length; i++) {
		if (objs[i][1] !== null) {
			sign += objs[i][0] + '' + ((objs[i][1] === null || objs[i][1] === undefined) ? '' : objs[i][1])
		}
	}
	sign = APPSECRET + sign + APPSECRET
	sign = MD5(sign).toLowerCase()
	var objStr = ''
	for (let i in objPar) {
		if (objPar[i] !== null) {
			// 拼接参数
			objStr += '&' + i + '=' + ((encode === null || encode) ? encodeURIComponent(objPar[i]) : objPar[i])
		}
	}
	objStr = objStr.substr(1) + '&sign=' + sign
	return objStr
}
const __objSort = res => {
	var str = []
	// 将对象转成数组
	for (var i in res) {
		str.push([i, res[i]])
	}
	// 对数组进行排序
	_sort(str, function (a, b) {
		return a[0] > b[0]
	})
	return str
}

/**
 * 模拟 sort 排序 (解决 Safari 下 soft 的 BUG)
 * @param  {Array}   array 需要排序的数组
 * @param  {Function} fn   排序函数
 * @return {Array}         返回排序后的数组
 */
const _sort = (array, fn) => {
	for (var i = 0; i < array.length - 1; i++) {
		var isSorted = true
		for (var j = 0; j < array.length - 1 - i; j++) {
			if (fn(array[j], array[j + 1]) > 0) {
				var temp = array[j]
				array[j] = array[j + 1]
				array[j + 1] = temp
				isSorted = false
			}
		}
		if (isSorted) {
			return false
		}
	}
}
export const _http = (url = '', data = {}, fn = function () {}) => {
	axios.post(url, _httpEncode(data), {
		timeout: 60000
	})
		.then(res => {
			fn(res.data)
		})
		.catch(error => {
			console.log('Error', error.message)
		})
}
/**
 * 随机数生成器
 * @param {*} n 位数
 */
export const _UUID = (n) => {
	n = n || 15
	let s = []
	let hexDigits = '0123456789abcdef'
	for (let i = 1; i < n; i++) {
		s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
	}
	s[8] = hexDigits.substr((s[8] & 0x3) | 0x8, 1)
	let uuid = 'M' + s.join('')
	return uuid
}
/**
 * 请求数据
 * @param {String} url
 * @_v_ :1.0
 */
// 1.0版本
export const _fetch = (url = '', data = {}, fn = function () {}) => {
	let URI = window.location.protocol + '//' + _URL_ + '/' + url
	axios.post(URI, _dataEncode(data), {
		timeout: 60000
	})
	.then(res => {
		fn(res.data)
		// if (res.data.code === 1007) {
		// 	_removeItem('token')
		// 	_removeItem('id')
		// 	// 未登录
		// 	setTimeout(() => {
		// 		window.location.href = '/account/login/'
		// 	}, 50)
		// } else if (res.data.code === 1011) {
		// 	// 需要实名认证
		// 	setTimeout(() => {
		// 		window.location.href = '/account/realname/'
		// 	}, 1000)
		// } else if (res.data.code === 1004) {
		// 	// 余额不足
		// 	setTimeout(() => {
		// 		window.location.href = '/account/recharge/'
		// 	}, 1000)
		// } else {
		// 	fn(res.data)
		// }
	})
	.catch(error => {
		console.log('Error', error.message)
	})
}
export const __AJAX = (url, data = {}, fn = function () {}) => {
	if (!url) return false
	let URL = window.location.protocol + '//' + _CZBURL_ + url + '?' + __joinParam(data)
	axios.post(URL)
	.then(res => {
		if (res.status === 200) {
			fn(res.data)
		}
	})
	.catch(error => {
		console.log(error.message)
	})
}

export const __joinParam = (n) => {
	var objStr = ''
	for (let i in n) {
		if (n[i] !== null) {
			// 拼接参数
			objStr += '&' + i + '=' + n[i]
		}
	}
	objStr = objStr.substr(1)
	return objStr
}

/**
* 检测手机
* @param {Number} mobile
* @returns {Boolean}
*/
export const _isMobile = (mobile) => {
	var REG = /^(13|14|15|17|18)[0-9]{9}$/
	if (REG.test(mobile)) return false
	else return true
}
/**
 * 检测密码
 * @param {String} pass
 * @returns {Boolean}
 */
export const _isPass = (pass) => {
	var REG = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/
	if (REG.test(pass)) return false
	else return true
}

/**
 * 检测验证码
 * @param {String} code
 * @returns {Boolean}
 */
export const _isCode = (code) => {
	var REG = /^\d{6}$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测加油卡
 * @param {String} code
 * @returns {Boolean}
 */
export const _isCardY = (code) => {
	var REG = /^\d{16}$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测银行卡
 * @param {String} code
 * @returns {Boolean}
 */
export const _isCard = (code) => {
	var REG = /^\d{12,19}$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测加油卡
 * @param {String} code
 * @returns {Boolean}
 */
export const _isCardH = (code) => {
	var REG = /^\d{19}$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测支付密码
 * @param {String} code
 * @returns {Boolean}
 */
export const _isPay = (code) => {
	var REG = /^\d{6}$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测身份证号码
 * @param {String} code
 * @returns {Boolean}
 */
export const _isIdNo = (code) => {
	var REG = /^[1-9]{1}[0-9]{14}$|^[1-9]{1}[0-9]{16}([0-9]|[xX])$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测金额
 * @param {String} code
 * @returns {Boolean}
 */
export const _isMoney = (code) => {
	var REG = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
	if (REG.test(code)) return false
	else return true
}

/**
 * 检测真实姓名
 * @param {String} code
 * @returns {Boolean}
 */
export const _isRealName = (code) => {
	var REG = /^[\u4e00-\u9fa5]{2,20}$/g
	if (REG.test(code)) return false
	else return true
}
