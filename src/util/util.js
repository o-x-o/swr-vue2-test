export function isEqual (obj1, obj2) {
    // 先判断这俩是不是对象或者数组类型的
    if ((typeof obj1 !== "object" && obj1 !== null) || (typeof obj2 !== "object" && obj2 !== null)) {
        return obj1 === obj2
    }
    // 如果特意传的就是两个指向同一地址的对象
    if (obj1 === obj2) {
        return true
    }
    // 如果key的个数都不一样那么肯定不能相等 return false
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
        return false
    }
    for (let key in obj1) {
        if (!isEqual(obj1[key], obj2[key])) {
            return false
        }
    }
    return true
}