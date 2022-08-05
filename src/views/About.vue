<template>
  <div>关于页面:{{data}}</div>
</template>

<script>
import axios from 'axios'
//   import useSWR from 'swrv'
import SWR from '../util/swr'

export default {
  name: 'About',
  data() {
    return {
        data: ''
    }
  },
  async mounted() {
    console.log('关于')

      // '/proxy/lkblog'
    const fetcher = (url) => axios.post(url).then((res) => {
      console.log('About' + ': fetcher', res?.data, this.data)
      // this.data = res?.data
      return res?.data?.data
    })
    window.fetcher = fetcher
    const { data, error, isValidating, fetcher: fetcherCall, mutate } = await SWR('/proxy/lkblog/ws/api.php', fetcher, {
        // refreshInterval: 2000,
        // revalidateOnFocus: false,
        // revalidateOnReconnect: false,
        revalidateIfStale: false,
        onSuccess: (data) => {
          console.log('About' + ': onSuccess call', data)
          this.data = data
        }
    })
    console.log('About' + ': useSWR', data, error, isValidating, fetcherCall)
    window.mutate = () => {
        mutate().then((data) => {
            console.log('About' + ': mutate', data)
            // this.data = data
        })
    }
    this.data = data
  }
}
</script>
