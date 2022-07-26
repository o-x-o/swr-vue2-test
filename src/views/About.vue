<template>
  <div>关于页面:{{data?.data}}</div>
</template>

<script>
import axios from 'axios'
//   import useSWR from 'swrv'
import SWR from '../util/swr'

export default {
  name: 'About',
  data() {
    return {
        data: {}
    }
  },
  async mounted() {
    console.log('关于')

      // '/proxy/lkblog'
    const fetcher = (url) => axios.post(url).then((res) => {
      console.log('About' + ': fetcher', res?.data)
      this.data = res?.data
      return res?.data
    })
    const { data, error, isValidating, mutate } = await SWR('/proxy/lkblog/ws/api.php', fetcher, {
        // revalidateOnFocus: false,
        // revalidateOnReconnect: false,
        revalidateIfStale: false
    })
    console.log('About' + ': useSWR', data?.data, error, isValidating)
    window.mutate = () => {
        mutate().then((data) => {
            console.log('About' + ': mutate', data)
            this.data = data
        })
    }
    this.data = data
    // return {
    //   data,
    //   error
    // }
  }
}
</script>
