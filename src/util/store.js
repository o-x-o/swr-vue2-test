const data = {};
const events = {};

function $events(key) {
  return events[key] = events[key] || [];
}
/*global globalThis*/
/*eslint no-undef: "error"*/
const VuePrototype = (globalThis.Vue || {}).prototype || {}

/*
  设置一个全局变量
  eg:
    const user = setStore('user', { name: '甲日石' })
*/
export const setStore = VuePrototype.$setStore = function setStore(key, val) {
  data[key] = val;
  $events(key).forEach(e => {
    e(data[key]);
  });
  return data[key];
}

/*
  读取一个全局变量，如果不传参数则返回全部的全局变量
  eg:
    const user = getStore('user')
*/
export const getStore = VuePrototype.$getStore = function getStore(key) {
  return key == undefined ? data : data[key];
}

/*
  注册某个值更新时的触发方法。当 key 对应的 data 池中的值更新时，触发 fn ，fn 的参数为更新的值。第三个参数为true代表该 fn 只能注册一次。若注册多次onUpdate会触发多次。
  eg:
    const checkUser = (newUser) => { console.log(newUser) } 
    onUpdate('user', checkUser, true)
*/
export const onUpdate = VuePrototype.$onUpdate = function onUpdate(key, fn, once) {
  if (!once || !~$events(key).indexOf(fn)) $events(key).push(fn);
  return fn;
}

/*
  卸载之前 onUpdate 挂载在 $events(key) 的所有的注册事件。使之前注册的事件不再触发。
  eg:
    unUpdate('user', checkUser)
*/
export const unUpdate = VuePrototype.$unUpdate = function unUpdate(key, fn) {
  events[key] = $events(key).filter(e => e !== fn);
  return fn;
}