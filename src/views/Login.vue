<template>
  <div>登录了:{{data?.data}}</div>
</template>

<script>
//   import axios from 'axios'
//   import useSWR from 'swrv'

export default {
  name: 'Login',
  data() {
    return {
        data: {}
    }
  },
  mounted() {
    console.log('登录了')

      // '/proxy/lkblog'
    // const fetcher = (url) => axios.post(url).then((res) => {
    //   console.log('Login' + ': fetcher', res?.data)
    //   return res?.data
    // })
    // const { data, error } = useSWR('/proxy/lkblog', fetcher, {
    //     revalidateIfStale: false,
    //     revalidateOnFocus: false,
    //     revalidateOnReconnect: false
    // })
    // console.log('Login' + ': useSWR', data?.data, error)
    // return {
    //   data,
    //   error
    // }
  }
}
</script>
