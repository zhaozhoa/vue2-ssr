<template>
  <div>
      About page
      <ul>
        <li v-for="post in posts" :key="post.id">{{post.title}}</li>
      </ul>
  </div>
</template>

<script>
import axios from 'axios'
import {mapState, mapActions} from 'vuex'
export default {
 data() {
        return {
            msg:'vue-ssr',
        }
    },
  

  computed: {
    ...mapState(['posts'])
  },

    // 服务端渲染 只支持 beforeCreate 和 created
    // 不会等待 beforeCreate 和 created 中的异步操作
    // 不支持响应式

    // vue ssr 特殊为服务端渲染提供的钩子
    serverPrefetch() {
      return this.getPosts()
    },

  //  async created(){
  //     const {data} = await axios({
  //       method: 'GET',
  //       url: 'https://cnodejs.org/api/v1/topics'
  //     })
  //     this.posts = data.data
  //   },

    methods: {
        ...mapActions(['getPosts'])
    }
}
</script>

<style>

</style>