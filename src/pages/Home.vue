<template>
  <div>
      Home page
      <h1>{{msg}}</h1>
        <h2>测试交互</h2>
        <div>
            <input type="text" v-model="msg">
        </div>
        <div>
            <button @click="onClick">点击</button>
        </div>
  </div>
</template>

<script>
export default {
 data() {
        return {
            msg:'vue-ssr'
        }
    },
    methods: {
        onClick() {
            console.log('test');
        }
    }
}
</script>

<style>

</style>