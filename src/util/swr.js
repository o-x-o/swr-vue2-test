import { isEqual } from './util.js'
import { setStore, getStore } from './store.js'

export default async function SWR (key, fetcher, options = {}) {
    if (typeof key !== 'object') {
        key = {url: key}
    }

    const {url, ...params} = key
    const {
        revalidateIfStale = true,
        onError = () => {},
        onErrorRetry = () => {},
        onSuccess = () => {},
        shouldRetryOnError = false
    } = options

    const SWR_STORE_NAME = 'SWR_CACHE'
    let isValidating = false // 是否正在验证 TODO 改为堆栈处理所有的请求

    const cacheIndex = () => (getStore(SWR_STORE_NAME) || []).findIndex(item => isEqual(key, item.key)) // 深比较 TODO 性能优化 或者改成直接从STORE中取
    const getCache = () => (getStore(SWR_STORE_NAME) || [])[cacheIndex()]
    const setCache = ({data, error}) => {
        const store = getStore(SWR_STORE_NAME) || []
        const index = cacheIndex()
        if (~index) {
            store.splice(index, 1)
        }
        setStore(SWR_STORE_NAME, [
            ...store,
            {
                value: {
                    data,
                    error,
                    isValidating,
                    mutate
                },
                key
            }
        ])
    }

    const mutate = async (data) => {
        // TODO 此处只能修改缓存 不能直接作用于跟SWR相关的state 或 vue中的监测值 没多大意义
        if (data !== undefined) {
            if (typeof data === 'function') {
                data = await data()
            }
            setCache({
                data
            })
        }
        // if (isValidating) {
        //     return
        // }
        return refresh()
    }

    const refresh = async () => {
        const value = {}
        isValidating = true
        const fetch = fetcher(url, params) // useSWR 是这样传params的吗
        try {
            onSuccess(value.data = await fetch)
        } catch (error) {
            onError(value.error = error)
            if (shouldRetryOnError) {
                SWR(key, fetcher, options)
                onErrorRetry(error)
            }
        }
        isValidating = false
        // error时需要setStore吗
        setCache(value)
        return fetch
    }
    
    if (revalidateIfStale || getCache() === undefined) { // TODO 判断是否有请求 将现在的请求放入堆栈中
        await refresh()
    }

    return getCache().value
}